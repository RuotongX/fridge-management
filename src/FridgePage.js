import React from "react";
import { NavBar, SearchBar, List, Modal, Calendar, Input } from "antd-mobile";
import { AddOutline } from "antd-mobile-icons";
import moment from "moment";
import "./FridgePage.css";

export default function FridgePage() {
  // var selectDate = "";
  const right = <AddOutline fontSize={30} onClick={handleAddFood} />;
  const currentDate = moment().format("YYYY-MM-DD");
  const defaultSingle = new Date(currentDate);
  const back = <div />;

  function handleAddFood() {
    Modal.show({
      content: (
        <div>
        <Calendar
          selectionMode="single"
          defaultValue={defaultSingle}
          onChange={(val) => {
            console.log(val);
          }}
        >
          {" "}
        </Calendar>
        <Input
            placeholder="好吃的"
            className="InputBar"
            // value={value}
            //   onChange={val => {
            //     setValue(val)
            //   }}
          />
          <Input
            placeholder="有几个？"
            className="InputBar"
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
          key: "Add",
          text: "添加",
          primary: true,
        },
    ],
      showCloseButton: true,
    });
  }

  function handleEditFood() {
    Modal.show({
      content: (
        <div>
          <Calendar
            selectionMode="single"
            defaultValue={defaultSingle}
            onChange={(val) => {
              console.log(val);
              // selectDate = val;
            }}
          >
            {" "}
          </Calendar>
          <Input
            placeholder="还剩几个捏？"
            style ={{"border":"solid 1px #cfcfcf","borderRadius":"6px"}}
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

  const fakedata = [
    { name: "苹果", date: "2023/3/1", amout: 5 },
    { name: "猪肉", date: "2023/3/5", amout: 7 },
    { name: "香蕉", date: "2023/2/28", amout: 10 },
    { name: "猪肉", date: "2023/3/6", amout: 4 },
  ];
  return (
    <div>
      <NavBar
        right={right}
        backArrow={back}
        style={{ "--height": "100px", "--border-bottom": "1px #eee solid" }}
      >
        <div>冰箱里的宝藏</div>
        <SearchBar placeholder="害害，来啦" className="SearchBar" />
      </NavBar>
      <List>
        {fakedata.map(function (food, index) {
          return (
            <List.Item
              key={index}
              description={food.date}
              extra={food.amout}
              onClick={handleEditFood}
            >
              {food.name}
            </List.Item>
          );
        })}
      </List>
    </div>
  );
}
