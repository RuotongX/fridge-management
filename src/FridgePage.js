import React from 'react'
import { NavBar, SearchBar, List, Modal} from 'antd-mobile'
import {  AddOutline } from 'antd-mobile-icons'
import './FridgePage.css'


export default function FridgePage() {
    const right =<AddOutline fontSize={30} onClick={handleAddFood}/>
    const back = <div/>
    function handleAddFood(){
        Modal.alert({
            content: '人在天边月上明',
            onConfirm: () => {
              console.log('Confirmed')
            },
          })
    }
    function handleEditFood(){
        Modal.alert({
            content: '人在天边月上明',
            onConfirm: () => {
              console.log('Confirmed')
            },
          })
    }
    const fakedata =[
        {name:'苹果', date:'2023/3/1'},
        {name:'猪肉',date:'2023/3/5'},
        {name:'香蕉',date:'2023/2/28'},
        {name:'猪肉',date:'2023/3/6'},
    ]
    return(
        <div>
        <NavBar right ={right} backArrow={back} style={{'--height':'100px','--border-bottom':'1px #eee solid'}}>
            <div>Fridge Content</div>
            <SearchBar placeholder='害害，来啦' className="SearchBar"/>
        </NavBar>
        <List >
            {fakedata.map(food => (
                <List.Item key={food.name} description={food.date} onClick={handleEditFood}>
                    {food.name}
                </List.Item>
            ))}
        </List>
    </div>
    );
}