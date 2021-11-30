const rewardCollection = require("./../modle/rewardModle");
const fs = require("fs");

exports.getAllReward = async (req, res) => {
  try {
    const query = await rewardCollection.find();
    console.log(query);
    res.status(201).json({
      status: "SUCCESS",
      data: {
        length: query.length,
        rewardList: query,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      message: "Invalid!",
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    const query = await rewardCollection.find({ user_id: req.params.id });
    const len = query[0].lenOfBatches;
    const rewardTypeList = JSON.parse(
      fs.readFileSync(`${__dirname}/../Rewards.json`)
    );

    const rewardArray = [];
    for (let i = 0; i < len; i++) {
      rewardArray.push(rewardTypeList[i].reward);
      console.log(rewardTypeList[i].reward);
    }

    res.status(201).json({
      status: "SUCCESS",
      data: {
        length: query.length,
        reward: rewardArray,
        rewardList: query,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      message: "User_id is Invalid",
    });
  }
};

exports.createOne = async (req, res) => {
  try {
    const rewardTypeList = JSON.parse(
      fs.readFileSync(`${__dirname}/../Rewards.json`)
    );

    newObject = {
      user_id: req.body.id,
      track: [{ index: 0, batchNumber: [] }],
      batches: [{ blocks: rewardTypeList[0].batch_0 }],
    };

    //new document
    const newProblem = await rewardCollection.create(newObject);
    // console.log(req.body);

    res.status(201).json({
      status: "SUCCESS",
      data: {
        message: newProblem,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      message: "Invalid!",
      error: e,
    });
  }
};

exports.updateReward = async (req, res) => {
  try {
    // const obj = await rewardCollection
    //   .findOne({ user_id: req.body.id }, "count lenOfBatches")
    //   .exec();

    // console.log(
    //   `Count : ${obj.count}`,
    //   `Length Of Batches : ${obj.lenOfBatches}`
    // );

    //getting user Data From Database
    const userObj = await rewardCollection.findOne({ user_id: req.body.id });

    const lenOfBatches = userObj.lenOfBatches;
    const count = userObj.count;
    // const objId = userObj.track[lenOfBatches]._id;

    // console.log(req.body.categoryDetails);

    //check fun
    const indexNumber = check(userObj, req.body.categoryDetails);
    // console.log(indexNumber);

    if (indexNumber != -1) {
      const block_id = userObj.batches[lenOfBatches]._id;
      // console.log(block_id);

      //set "isDone" field to true For what is located at given indexNumber in Blocks
      await rewardCollection.updateOne(
        {
          user_id: req.body.id,
          "track.index": lenOfBatches,
        },
        {
          $set: {
            "batches.$[item].blocks.$[ele].isDone": true,
            "batches.$[item].blocks.$[ele].date": new Date(),
            count: userObj.count + 1,
          },
          $push: {
            "track.$.blockNumber": indexNumber,
            // "track.$[val].batchNumber": indexNumber,
          },
        },
        {
          arrayFilters: [
            { "item._id": block_id },
            { "ele.index": indexNumber },
            // { "val.index": lenOfBatches },
          ],
        }
      );

      const rewardTypeList = JSON.parse(
        fs.readFileSync(`${__dirname}/../Rewards.json`)
      );
      if (userObj.count + 1 === 4) {
        const batchNumber = `batch_${lenOfBatches + 1}`;
        await rewardCollection
          .updateOne(
            { user_id: req.body.id },
            {
              $push: {
                batches: {
                  blocks: rewardTypeList[lenOfBatches + 1][batchNumber],
                },
                track: {
                  index: lenOfBatches + 1,
                  batchNumber: [],
                },
              },
              $inc: { count: -4, lenOfBatches: 1 },
            }
          )
          .exec((err, res) => {
            console.log(res);
          });
      }

      const rewardArray = [];
      for (let i = 0; i < lenOfBatches; i++) {
        rewardArray.push(rewardTypeList[i].reward);
      }

      const result = await rewardCollection.findOne({ user_id: req.body.id });
      res.status(201).json({
        status: "SUCCESS",
        data: {
          message: result,
          reward: rewardArray,
        },
      });
    } else {
      // there is not related Categotry.
      res.status(201).json({
        status: "NO CATEGORY",
        // data: {
        //   message: result,
        // },
      });
    }
  } catch (e) {
    res.status(401).json({
      status: "fail",
      message: "Invalid!",
      error: e,
    });
    console.log(e);
  }
};

//to check that there is any related Block is avialable or not
function check(userObj, categoryDetails) {
  lastBlock = userObj.batches[userObj.lenOfBatches].blocks;

  for (let index = 0; index < lastBlock.length; index++) {
    let item = lastBlock[index];
    if (
      item.category === categoryDetails.category &&
      item.free === categoryDetails.free &&
      item.fees === categoryDetails.fees &&
      item.isDone === false
    ) {
      return index;
    }
  }

  return -1;
}
