import React, { useState } from "react";
import { NavBar, SearchBar, List, Modal, Calendar, Input } from "antd-mobile";
import { AddOutline, RedoOutline } from "antd-mobile-icons";
import moment from "moment";
import cloneDeep from "lodash/cloneDeep";
import "./FridgePage.css";
import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export default function FridgePage() {
  var selectDate = "";
  var inputName = "";
  var inputAmount = "";
  const right = <AddOutline fontSize={30} onClick={handleAddFoodModal} />;
  const refresh = <RedoOutline fontSize={25} onClick={RefreshFood} />;
  const currentDate = moment().format("YYYY-MM-DD");
  const defaultSingle = new Date(currentDate);
  const [foodData, setFoodData] = useState([]);
  const firebaseConfig = {
    config
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const dbRef = collection(db, "13joystreet");

  const getFoods = async () => {
    const colRef = collection(db, "13joystreet");
    const docsSnap = await getDocs(colRef);
    let tempdata = [];
    docsSnap.forEach((doc) => {
      tempdata.push({
        id: doc.id,
        name: doc.data().name,
        date: doc.data().date,
        amount: doc.data().amount,
      });
    });
    setFoodData(tempdata);
  };

  React.useEffect(() => {
    getFoods();
  }, []);

  function handleAddFoodModal() {
    selectDate = "";
    inputAmount = "";
    inputName = "";
    Modal.show({
      content: (
        <div>
          <Calendar
            selectionMode="single"
            defaultValue={defaultSingle}
            onChange={(val) => {
              selectDate = moment(val).format("YYYY-MM-DD");
              console.log(selectDate);
            }}
          >
            {" "}
          </Calendar>
          <Input
            placeholder="好吃的"
            className="InputBar"
            onChange={(val) => {
              inputName = val;
            }}
          />
          <Input
            placeholder="有几个？"
            className="InputBar"
            onChange={(val) => {
              inputAmount = val;
            }}
          />
        </div>
      ),
      closeOnAction: true,
      actions: [
        {
          key: "Add",
          text: "添加",
          primary: true,
          onClick: handleAddFood,
        },
      ],
      showCloseButton: true,
    });
  }

  function handleEditFoodModal(index, id) {
    selectDate = foodData[index].date;
    inputAmount = foodData[index].amount;
    const tempdate = new Date(selectDate);
    inputName = "";
    Modal.show({
      content: (
        <div>
          <Calendar
            selectionMode="single"
            defaultValue={tempdate}
            onChange={(val) => {
              console.log(val);
              selectDate = moment(val).format("YYYY-MM-DD");
            }}
          >
            {" "}
          </Calendar>
          <Input
            placeholder="还剩几个捏？"
            style={{ border: "solid 1px #cfcfcf", borderRadius: "6px" }}
            onChange={(val) => {
              if (val === "") {
                inputAmount = foodData[index].amount;
              } else {
                inputAmount = val;
              }
            }}
          />
        </div>
      ),
      closeOnAction: true,
      actions: [
        {
          key: "decrease",
          text: "吃掉一个",
          primary: true,
          onClick: (e) => handleDecreaseOneFood(index, id),
        },
        {
          key: "confirm",
          text: "修改日期or数量",
          onClick: (e) => handleEditFood(index, selectDate, inputAmount, id),
        },
        {
          key: "delete",
          text: "删除",
          onClick: (e) => handleDeleteFood(index, id),
        },
      ],
      showCloseButton: true,
    });
  }

  function FoodDateSort(date) {
    if (
      moment(date).format("YYYYMMDD") - moment(currentDate).format("YYYYMMDD") <
      0
    ) {
      return "ExpiredFood";
    } else if (
      moment(date).format("YYYYMMDD") -
        moment(currentDate).format("YYYYMMDD") <=
        4 &&
      moment(date).format("YYYYMMDD") -
        moment(currentDate).format("YYYYMMDD") >=
        0
    ) {
      return "ClosedExpireFood";
    } else {
      return "NormalFood";
    }
  }

  function SearchFood(name) {
    var newdata = [];
    foodData.forEach((food) => {
      if (food.name.includes(name)) {
        newdata.push(food);
      }
    });
    setFoodData(newdata);
  }

  function RefreshFood() {
    getFoods();
  }

  const handleAddFood = async () => {
    addDoc(dbRef, {
      name: inputName,
      date: selectDate,
      amount: inputAmount,
    }).then((docRef) => {
      console.log("I am here");
      setFoodData([
        ...foodData,
        {
          name: inputName,
          date: selectDate,
          amount: inputAmount,
          id: dbRef.id,
        },
      ]);
    });
  };

  function handleEditFood(index, selectDate, inputAmount, id) {
    var newdata = cloneDeep(foodData);
    newdata[index].date = selectDate;
    newdata[index].amount = inputAmount;
    const docRef = doc(db, "13joystreet", id);
    const updateData = {
      name: newdata[index].name,
      date: newdata[index].date,
      amount: newdata[index].amount,
    };
    updateDoc(docRef, updateData)
      .then((docRef) => {
        console.log(
          "A New Document Field has been added to an existing document"
        );
      })
      .catch((error) => {
        console.log(error);
      });
    setFoodData(newdata);
  }

  function handleDeleteFood(index, id) {
    const docRef = doc(db, "13joystreet", id);
    deleteDoc(docRef)
      .then(() => {
        console.log("Entire Document has been deleted successfully.");
      })
      .catch((error) => {
        console.log(error);
      });
    var newdata = cloneDeep(foodData);
    newdata.splice(index, 1);
    setFoodData(newdata);
  }
  function handleDecreaseOneFood(index, id) {
    var newdata = cloneDeep(foodData);
    newdata[index].amount--;
    if (newdata[index].amount <= 0) {
      newdata.splice(index, 1);
      const docRef = doc(db, "13joystreet", id);
      deleteDoc(docRef)
        .then(() => {
          console.log("Entire Document has been deleted successfully.");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    const docRef = doc(db, "13joystreet", id);
    const updateData = {
      name: newdata[index].name,
      date: newdata[index].date,
      amount: newdata[index].amount,
    };
    updateDoc(docRef, updateData)
      .then((docRef) => {
        console.log(
          "A New Document Field has been added to an existing document"
        );
      })
      .catch((error) => {
        console.log(error);
      });
    setFoodData(newdata);
  }

  return (
    <div>
      <NavBar
        right={right}
        backArrow={refresh}
        style={{ "--height": "100px", "--border-bottom": "1px #eee solid" }}
      >
        <div>冰箱里的宝藏</div>
        <SearchBar
          placeholder="害害，来啦"
          className="SearchBar"
          onSearch={SearchFood}
          onClear={RefreshFood}
        />
      </NavBar>
      <List>
        {foodData
          .sort((a, b) =>
            moment(a.date).format("YYYYMMDD") >
            moment(b.date).format("YYYYMMDD")
              ? 1
              : -1
          )
          .map(function (food, index) {
            return (
              <List.Item
                key={index}
                description={food.date}
                extra={food.amount}
                onClick={(e) => handleEditFoodModal(index, food.id)}
                className={FoodDateSort(food.date)}
              >
                {food.name}
              </List.Item>
            );
          })}
      </List>
    </div>
  );
}
