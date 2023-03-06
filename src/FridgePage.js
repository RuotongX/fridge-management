import React, { useState, useEffect } from "react";
import { NavBar, SearchBar, List, Modal, Calendar, Input } from "antd-mobile";
import { AddOutline, RedoOutline } from "antd-mobile-icons";
import moment from "moment";
import cloneDeep from "lodash/cloneDeep";
import "./FridgePage.css";

export default function FridgePage() {
  var selectDate = "";
  var inputName = "";
  var inputAmount = "";
  var selectFood = "";
  const right = <AddOutline fontSize={30} onClick={handleAddFoodModal} />;
  const refresh = <RedoOutline fontSize={25} onClick={RefreshFood} />;
  const currentDate = moment().format("YYYY-MM-DD");
  const defaultSingle = new Date(currentDate);
  const [foodData, setFoodData] = useState([
    { name: "苹果", date: "2023/3/1", amount: 5 },
    { name: "猪肉", date: "2023/3/9", amount: 7 },
    { name: "香蕉", date: "2023/2/28", amount: 10 },
    { name: "猪肉", date: "2023/3/20", amount: 4 },
  ]);

  //   React.useEffect(()=>{

  //   });

  function handleAddFoodModal() {
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

  function handleEditFoodModal() {
    Modal.show({
      content: (
        <div>
          <Calendar
            selectionMode="single"
            defaultValue={defaultSingle}
            onChange={(val) => {
              console.log(val);
              //   setSelectDate(moment(val).format('YYYY-MM-DD'));
            }}
          >
            {" "}
          </Calendar>
          <Input
            placeholder="还剩几个捏？"
            style={{ border: "solid 1px #cfcfcf", borderRadius: "6px" }}
            // value={value}
            //   onChange={val => {
            //     setValue(val)
            //   }}
          />
        </div>
      ),
      closeOnAction: true,
      actions: [
        {
          key: "decrease",
          text: "吃掉一个",
          primary: true,
        //   onClick:handleDecreaseOneFood(),
        },
        {
          key: "confirm",
          text: "修改日期or数量",


          //   onClick: handleEditDate(food,selectDate),
        },
        {
          key: "delete",
          text: "删除",
        },
      ],
      showCloseButton: true,
    });
  }

  // function handleEditDate(food,date){
  //     let index = fakedata.findIndex((item)=>item.name === food)
  //     fakedata[index].date = moment(date).format('YYYY-MM-DD')
  // }
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
      if (food.name === name) {
        newdata.push(food);
      }
    });
    setFoodData(newdata);
  }

  function RefreshFood() {
    const newdata = [
      { name: "苹果", date: "2023/3/1", amount: 5 },
      { name: "猪肉", date: "2023/3/9", amount: 7 },
      { name: "香蕉", date: "2023/2/28", amount: 10 },
      { name: "猪肉", date: "2023/3/20", amount: 4 },
    ];
    setFoodData(newdata);
  }

  function handleAddFood() {
    var newdata = cloneDeep(foodData);
    newdata.push({ name: inputName, date: selectDate, amount: inputAmount });
    setFoodData(newdata);
    selectDate = "";
    inputName = "";
    inputAmount = "";
  }

  
  

  //   function handleEditFood(){

  //   }

//   function handleDeleteFood(){

//   }
    // function handleDecreaseOneFood(){
    //     var newdata = cloneDeep(foodData);
    //     const Index = newdata.findIndex((item)=>item.name === selectFood)
    //     console.log(selectFood);
    //     newdata[Index].amount--;
    //     setFoodData(newdata);
    //     selectFood = "";
    // }

  //   const fakedata = [
  //     { name: "苹果", date: "2023/3/1", amout: 5 },
  //     { name: "猪肉", date: "2023/3/9", amout: 7 },
  //     { name: "香蕉", date: "2023/2/28", amout: 10 },
  //     { name: "猪肉", date: "2023/3/20", amout: 4 },
  //   ];
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
                
                onClick={handleEditFoodModal}
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
