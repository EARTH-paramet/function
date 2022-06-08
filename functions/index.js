const { default: axios } = require("axios");
const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
const database = admin.firestore();


exports.productAdded = functions.firestore
  .document("/product/{docProductId}/{group}/{docId}")
  .onCreate(async (snap, context) => {
    const values = snap.data();
    const productId = context.params.docProductId;
    const group = context.params.group;

    const category = await database.collection(
      `/product/${productId}/category`
    );
    var byGroup;
    if (group == "group1") {
      byGroup = 1;
    } else if (group == "group2") {
      byGroup = 2;
    } else if (group == "group3") {
      byGroup = 3;
    }

    await category
      .where("group", "==", byGroup)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          if (doc.data().name == values.category) {
            return category.doc(doc.id).set({
              group: doc.data().group,
              name: doc.data().name,
              qty: doc.data().qty + 1,
            });
          }
        });
      });

    return Promise.resolve();
  });

exports.productUpdated = functions.firestore
  .document("/product/{docProductId}/{group}/{docId}")
  .onUpdate(async (snap, context) => {
    const newValues = snap.after.data();
    const oldValues = snap.before.data();
    const productId = context.params.docProductId;
    const group = context.params.group;

    const category = await database.collection(
      `/product/${productId}/category`
    );
    var byGroup;
    if (newValues.category !== oldValues.category) {
      if (group == "group1") {
        byGroup = 1;
      } else if (group == "group2") {
        byGroup = 2;
      } else if (group == "group3") {
        byGroup = 3;
      }

      await category
        .where("group", "==", byGroup)
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            if (doc.data().name == oldValues.category) {
              category.doc(doc.id).set({
                group: doc.data().group,
                name: doc.data().name,
                qty: doc.data().qty - 1,
              });
            }
            if (doc.data().name == newValues.category) {
              category.doc(doc.id).set({
                group: doc.data().group,
                name: doc.data().name,
                qty: doc.data().qty + 1,
              });
            }
          });
        });
    }
    return Promise.resolve();
  });

exports.productDeleted = functions.firestore
  .document("/product/{docProductId}/{group}/{docId}")
  .onDelete(async (snap, context) => {
    const values = snap.data();
    const productId = context.params.docProductId;
    const group = context.params.group;

    const category = await database.collection(
      `/product/${productId}/category`
    );
    var byGroup;
    if (values) {
      if (group == "group1") {
        byGroup = 1;
      } else if (group == "group2") {
        byGroup = 2;
      } else if (group == "group3") {
        byGroup = 3;
      }

      await category
        .where("group", "==", byGroup)
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            if (doc.data().name == values.category) {
              category.doc(doc.id).set({
                group: doc.data().group,
                name: doc.data().name,
                qty: doc.data().qty - 1,
              });
            }
          });
        });
    }
    return Promise.resolve();
  });

const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer U9aWTeZROF3UR5Fv4FX65UYBKaJefLsC2Kgeh0dR/sQAzPEm2GXISXbukNpncv3oM+EwOSdABHqN9iEYuGMadPmc6LS4AVZi6CHf3e2g8nuEb2dJ4XzttBVwzOi6y5N8O0yVb1/BaYwvYwL5FNT4TAdB04t89/1O/w1cDnyilFU=`,
};

exports.scheduledFunction1 = functions.pubsub
  .schedule("*/30 * * * *")
  .timeZone("Asia/Bangkok")
  .onRun(async (context) => {
    const timestamp_now = admin.firestore.Timestamp.now();
    const dateToday =
      parseInt(timestamp_now._seconds / 86400) * 86400 - 60 * 60 * 7;
    const options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    };

    console.log("TEST DATE ", timestamp_now);

    await database
      .collection("product")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var user_id = "";
          var line_id = "";

          console.log("USER ID =>", doc.id);
          user_id = doc.id;
          database
            .collection("product")
            .where("uid", "==", doc.id)
            .get()
            .then((snapshot) => {
              var notification1=[];

              var cardTest=[]
const pushMessage = (message, line_id, product_qry,fridge) => {

  const card = {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "⚠️ มีรายการสินค้าหมดอายุ ⚠️",
          size: "lg",
          align: "center",
        },
        // {
        //   type: "text",
        //   text: "เนื่องจากสินค้าหมดอายุ",
        //   size: "lg",
        //   align: "center",
        // },
      ],
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: `📣 แจ้งเตือน ตู้เย็น${fridge}`,
              weight: "bold",
            },
          ],
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "❌ สินค้าหมดอายุ",
              weight: "bold",
            },
          ],
          margin: "lg",
        },
        {
          type: "box",
          layout: "vertical",
          contents: product_qry,
          // [{
          //   type: "text",
          //   text: `Test`,
          //   wrap: true,
          // },{
          //   type: "text",
          //   text: `Test`,
          //   wrap: true,
          // }]
          margin: "lg",
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "button",
          action: {
            type: "uri",
            label: "OPEN APP",
            uri: `https://exp-project.vercel.app/notification`,
          },
          style: "primary",
        },
      ],
    },
    styles: {
      body: {
        separator: true,
      },
    },
  };



  if(line_id=="null"){
    cardTest.push(card).then(()=>{
      return null
    })
    
  }else{
    cardTest.push(card)
    return  axios({
      method: "POST",
      url: `${LINE_MESSAGING_API}/push`,
      headers: LINE_HEADER,
      data: JSON.stringify({
        to: `${line_id}`,
        messages: [
          {
            type: "flex",
            altText: `⚠️ แจ้งเตือนวันหมดอายุสินค้า  ⚠️`,
            contents: {
              type: "carousel",
              contents: cardTest,
            },
          },
        ],
      }),
    }).then(()=>{
      cardTest = []
    })
  }
  
};

              snapshot.forEach((doc) => {
                line_id = doc.data().line_sub;
                console.log("LINE NOTIFICATIONS", line_id);
                // group.map((valGroup) => {
                database
                  .collection("product")
                  .doc(user_id)
                  .collection("group1")
                  // .where("barcode", "!=", "")
                  .get()
                  .then((snapshot) => {
                    var data_product = [];
                    snapshot.forEach((doc) => {
                      if (doc.data().date.seconds >= dateToday + 86400) {
                        console.log("EAT=TRUE");
                      } else {
                        console.log("EAT=FALSE");
                        if (doc.data().name != "") {
                          console.log(
                            "log NAME",
                            doc.data().name,
                            `${doc.data().name}`
                          );
                          data_product.push({
                            type: "text",
                            text: `${doc.data().name}`,
                            wrap: true,
                          });
                        }
                      }
                    });
                    
                    if (data_product.length != 0) {
                      console.log("PUSH MESSAGE");
                      if (line_id != "") {
                        console.log("data_product=>", data_product);
                        pushMessage("แจ้งเตือน", "null", data_product,'1');
                      }
                    } else {
                      console.log("FALSE ELSE");
                      pushMessage("แจ้งเตือน", "null",[{
                        type: "text",
                        text: `ไม่มี`,
                        wrap: true,
                      }],'1');

                    }
                  })

                  database
                  .collection("product")
                  .doc(user_id)
                  .collection("group2")
                  .where("barcode", "!=", "")
                  .get()
                  .then((snapshot) => {
                    var data_product = [];
                    snapshot.forEach((doc) => {
                      if (doc.data().date.seconds >= dateToday + 86400) {
                        console.log("EAT=TRUE");
                      } else {
                        console.log("EAT=FALSE");
                        if (doc.data().name != "") {
                          console.log(
                            "log NAME",
                            doc.data().name,
                            `${doc.data().name}`
                          );
                          data_product.push({
                            type: "text",
                            text: `${doc.data().name}`,
                            wrap: true,
                          });
                        }
                      }
                    });
                    
                    if (data_product.length != 0) {
                      console.log("PUSH MESSAGE");
                      if (line_id != "") {
                        console.log("data_product=>", data_product);
                        pushMessage("แจ้งเตือน", "null", data_product,'2');
                      }
                    } else {
                      console.log("FALSE ELSE");
                      pushMessage("แจ้งเตือน", "null",[{
                        type: "text",
                        text: `ไม่มี`,
                        wrap: true,
                      }],'2');
                    }
                  })
               
                  database
                  .collection("product")
                  .doc(user_id)
                  .collection("group3")
                  // .where("barcode", "!=", "")
                  .get()
                  .then((snapshot) => {
                    var data_product = [];
                    snapshot.forEach((doc) => {
                      if (doc.data().date.seconds >= dateToday + 86400) {
                        console.log("EAT=TRUE");
                      } else {
                        console.log("EAT=FALSE");
                        if (doc.data().name != "") {
                          console.log(
                            "log NAME",
                            doc.data().name,
                            `${doc.data().name}`
                          );
                          data_product.push({
                            type: "text",
                            text: `${doc.data().name}`,
                            wrap: true,
                          });
                        }
                      }
                    });
                    
                    if (data_product.length != 0) {
                      console.log("PUSH MESSAGE");
                      if (line_id != "") {
                        console.log("data_product=>", data_product);
                        pushMessage("แจ้งเตือน", line_id, data_product,'3');
                      }
                    } else {
                      console.log("FALSE ELSE");
                      pushMessage("แจ้งเตือน", "null",[{
                        type: "text",
                        text: `ไม่มี`,
                        wrap: true,
                      }],'3');
                    }
                  })
                   
              });
            });
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
    return null;
  });

