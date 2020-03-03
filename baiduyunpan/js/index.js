{
  let pid = -1; //顶层的pid;
  let topId = -1;  //顶层id;
  let nowId = 1;  // 面包屑中当前选中项的id;
  

  /* 数据操作 */
  /* 获取自己
   Object getSelf(id)  根据id获取对应的当前项数据
  参数:
     id
  返回值:
     当前项数据
   */
  function getSelf(id){
   return data.filter(item=>id==item.id)[0];
  }
  /* 获取子级 
  Array getChildren(id) 根据父级的id 找到它的所有子级
  参数：
    pid
  返回值:当前id下的所有子级
  */
  function getChildren(id){
    return data.filter(item=>item.pid == id);
     
  }

  /*  查找父级
    Object  getParent(id)根据当前项Id 找到它的父级
     参数：
        当前项的Id  
     返回值：
        当前项的父级
   */
  function getParent(id){
    let  s = getSelf(id);
    return getSelf(s.pid);
  }

 /* 
 获取所有父级
Array  getAllParent()  根据当前项的id 获取它所有的父级
   参数：
     id 当前项id
   返回值：
      对应的所有父级
  */

 function getAllParent(id){
   let parent = getParent(id);
   let allParent =[];
   while(parent){
     allParent.unshift(parent);
     parent = getParent(parent.id);
   }
   return allParent;
 }


 /* 视图渲染 */

 /* 视图渲染 */
 let  treeMenu = document.querySelector("#tree-menu");
 let  breadNav = document.querySelector(".bread-nav");
 let  floders = document.querySelector("#floders");

//  breadNav.innerHTML = renderBreacNav();
//  floders.innerHTML = renderFloders();
//  treeMenu.innerHTML = renderTreeMenu(-1,0);
  render();
/* 树状菜单的渲染 
1.open的状态的时候，当前项是打开状态的时候，就要保证当前项所有的父级也是要打开的状态。
所以还要找到当前项的父级
*/
function renderTreeMenu(pid,level){  // level控制层级从而控制每一层的缩进距离
  let child = getChildren(pid);  // 根据父id 获取子级 最顶层的父id 就是顶层数据的pid
  /* 
 根据当前项的id，找到当前项这个对象本身。以及所对应的所有的父级。
   */
  let nowAllParent = getAllParent(nowId);
  nowAllParent.push(getSelf(nowId));
  let inner =`
  <ul>
     ${child.map(item=>{
       let itemChild = getChildren(item.id);
       return `<li class="${nowAllParent.includes(item)?"open":''}">
         <p 
         style="padding-left:${40+level*15}px" 
         class="${itemChild.length>0?"has-child":''} ${item.id==nowId?"active":''}"
         data-id="${item.id}"
         >
         <span>${item.title}</span>
         </p>
          ${itemChild.length>0?renderTreeMenu(item.id,level+1):''}
       </li>`
     }).join("")}
  </ul>
  `;
  return inner;
}


/* 路径导航渲染 */
function renderBreacNav(){
   let nowSelf = getSelf(nowId);
   let allParent = getAllParent(nowId);
   let inner = "";
   allParent.forEach(item=>{
     inner +=`<a data-id="${item.id}">${item.title}</a>`;
   });
   inner += `<span>${nowSelf.title}</span>`;
   return inner;
}

/* 文件夹区域渲染 */
function renderFloders(){
   let children = getChildren(nowId);
   let floderInner="";
   children.forEach(item=>{
     floderInner += `<li class="floder-item" data-id="${item.id}">
           <img src="./img/folder-b.png" alt=""/>
           <span class="floder-name">${item.title}</span>
         </li>`;
   })
   return floderInner;
}

/* 三大视图的操作事件 */

function render(){
   breadNav.innerHTML = renderBreacNav();
   floders.innerHTML = renderFloders();
   treeMenu.innerHTML = renderTreeMenu(topId,0);
}
// 树状菜单操作
treeMenu.addEventListener("click",function(e){
   console.log(e);
  let item = null;
  item = e.target.tagName ==="SPAN"?e.target.parentNode:e.target;
  if(item){
    nowId = item.dataset.id;
    render();
  }
})

// 面包屑菜单点击事件
breadNav.addEventListener("click",function(e){
   let item = null;
   if(e.target.tagName === "A"){
     item = e.target;
   }
   if(item){
     nowId = item.dataset.id;
     render();
   }
})
// 文件夹区域点击事件
floders.addEventListener("click",function(e){
  let item = null;
  if(e.target.tagName=="LI"){
    item = e.target;
  }else if(e.target.tagName=="IMG"){
    item = e.target.parentNode;
  }
  if(item){
   nowId = item.dataset.id;
   render();
  }
  
})

// 新建文件夹功能

let createBtn = document.querySelector(".create-btn");
createBtn.addEventListener('click',function(){
     data.push({
       id: Date.now(),
       pid:nowId,
       title:getName()
     });
    //  console.log(data);
     render();
});

function getName(){
  let child = getChildren(nowId);  // 拿到当前节点下的所有子集
  let newData = child.map(item=>item.title); // 拿到子集数组中每一个对象的title项。
   newData = newData.filter(item=>{
       if(item === "新建文件夹"){
         return true;
       }
      //  console.log(item.substring(0,6) === "新建文件夹(",Number(item.substring(6,item.length -1))>=2,item[item.length -1] === ")"); 
       if(item.substring(0,6) === "新建文件夹("
        && Number(item.substring(6,item.length -1))>=2
        && item[item.length -1] === ")")
       {
         return true;
       }
       return false;
     });
    newData.sort((n1,n2)=>{
       n1 = n1.substring(6,n1.length -1);
       n2 = n2.substring(6,n2.length -1);
       n1 = isNaN(n1)?0:n1;
       n2 = isNaN(n2)?0:n2;
       return n1 -n2;
     });
     if(newData[0] !== "新建文件夹"){
         return "新建文件夹";
     }
     for(let i= 1;i<newData.length;i++){
       if(Number(newData[i].substring(6,newData[i].length-1)) !== i+1){
         return `新建文件夹(${i+1})`;
       }
     }
     return `新建文件夹(${newData.length+1})`;
}

}
