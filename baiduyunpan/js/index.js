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


/* 
 获取所有的子集  getAllChidren(id)  
 这里注意区别 getChildren()方法;getChildren找到的只有儿子。
 而getAllChldren(id);不仅要找到儿子还要找到孙子
 参数：
    当前项数据的id ;
  返回值：
    返回值：当前项数据下面的所有子集 
 */
function getAllChildren(id){
  let children = getChildren(id);
  let allChildren =[];
  if(children.length>0){
    // 先把孩子放在数组中去
    allChildren = allChildren.concat(children);
    //然后再去循环每一个孩子递归调用
    children.forEach(item=>{
      allChildren = allChildren.concat(getChildren(item.id));
    });
  }
  return allChildren;
}
/* 
 删除单项数据  removeData(id) 通过id  删除当前项的数据
 参数：
    当前项数据的id ; 
 */
function removeData(id){
  let remove = getAllChildren(id);
  remove.push(getSelf(id));
  data =  data.filter(item=>!remove.includes(item));
  console.log(data);
  /* 
  这里如果这样写话 会有一个问题，就是的昂你删除一个含有子文件夹的文件时候，
  被删除的文件夹不存在了，但是该文件夹的所有子文件还在。
  所以这里还需要再获取一下他的所有子集，把该文件夹下的所有子集也都删除完。
   */
   render();
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
     alertSuccess("添加成功");
});
// 默认新建文件的名称
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

// 成功弹窗出现
function alertSuccess(info){
  let succ = document.querySelector(".alert-success");
  succ.innerHTML = info;
   succ.classList.add("alert-show");
   setTimeout(()=>{
     succ.classList.remove("alert-show");
   },1000)
}


//警告弹窗
function alertWarning(info){
  let succ = document.querySelector(".alert-warning");
  succ.innerHTML = info;
   succ.classList.add("alert-show");
   setTimeout(()=>{
     succ.classList.remove("alert-show");
   },1000)
}

/* 
 右键菜单事件
 */
// 阻止默认系统的右键事件 这里在全局监听
// 这里的contextmenu是类似于click的固定的 规定的事件名  代表鼠标右键事件
 let contextmenu = document.querySelector("#contextmenu");
  document.addEventListener("contextmenu",function(e){  
    // contextmenu.style.display = "none";  
    // 这里如果不加这个样式，以及下面 判断floder存在的时候不加那个阻止冒泡事件以及会有什么bug;
     e.preventDefault();
  });

  // 防止右键以后，点击其他区域，但是还是存在。
  window.addEventListener("mousedown",function(e){
    contextmenu.style.display = "none" ;
  })

  // 窗口改变的时候也要让他消失
  window.addEventListener('resize',function(e){
    contextmenu.style.display = "none" ;
  });
  // 滚动的时候
  window.addEventListener("scroll",function(e){
    contextmenu.style.display = "none" ;
  })
  /* 
  自身的右键事件还是采用事件代理的方式,我们的右键事件只有在点击文件夹的时候才触发的
  所以这里使用floders代理即可
   */
  
  floders.addEventListener("contextmenu",function(e){
    let floder = null ;
    if(e.target.tagName ===  "LI"){
      floder = e.target;
    }else if(e.target.parentNode.tagName === "LI"){
      floder = e.target.parentNode;
    }
    if(floder){
      // 这里要阻止一下冒泡,否则又会冒到 doucment 那里去了;
      contextmenu.style.display =  "block";
      /* 
      由于上面加了那个样式的249行 display 为none。所以这里需要再加一阻止冒泡的事件
       */
      // e.stopPropagation();
      // 加完阻止冒泡事件以后，顺带也会把那个右键默认事件也给阻止掉了，就不起作用了，所以还需要再次
      // 阻止一下默认的事件
      // e.preventDefault();
      let lstx = e.clientX;
      let lsty = e.clientY;
      let maxX= document.documentElement.clientWidth - contextmenu.offsetWidth ;
      let maxY= document.documentElement.clientHeight - contextmenu.offsetHeight;
      lstx = Math.min(lstx,maxX);
      lsty = Math.min(lsty,maxY);
      contextmenu.style.left = lstx + "px";
      contextmenu.style.top = lsty + "px";
      contextmenu.floder = floder;  
      // 这句和下面的点击移动删除以及重命名  怎么在点击的时候就能拿到this.floder 了？
      //  这里是什么关系呢？
    }

    //以上逻辑走完以后，当你鼠标在了那个悬浮出的菜单以后，会冒泡到document上去，然后那个菜单又会消失了。
    // 所以这个地方还要再做一个阻止冒泡的事件。只不过这个是那个contextmenu冒上去的。所以就阻止contextmenu
    // 的冒泡就可以了。
    contextmenu.addEventListener("mousedown",function(e){
      e.stopPropagation();
    });

    contextmenu.addEventListener("click",function(e){
        contextmenu.style.display = "none";
        if(e.target.classList.contains("icon-lajitong")){
          // console.log("删除", this.floder);
          confirm("您确定删除此文件夹吗",()=>{
               removeData(Number(this.floder.dataset.id));
               render();
               alertSuccess("删除成功");
          })
          
        }else if(e.target.classList.contains("icon-yidong")){
          console.log("移动");
        }else if(e.target.classList.contains("icon-zhongmingming")){
          console.log("重命名"); 
        }
    });
  });
 
 // 确认操作的实现
 /* 
 封装的时候，接收两个回调参数，一个提示信息
 第一个参数:表示是确定时候的回调函数。
 第二个参数:表示取消的函数
 第三个参数:里边的文案内容
  */
 let confirmEl = document.querySelector(".confirm");
 let confirmText = document.querySelector(".confirm-text");
 let closConfirm = confirmEl.querySelector(".clos");
 let mask = document.querySelector("#mask");
 let confirmBtns = document.querySelectorAll(".confirm-btns a");

//  confirm();
 function confirm(info,resolve,reject){
   confirmText.innerHTML = info;
   confirmEl.classList.add("confirm-show");
   mask.style.display = "block";
   /* 
   这个地方注意一下：不要在使用事件监听了，不然会导致每调用一次弹窗就会添加一个事件？
   这里不太理解？？？？？等着问肖磊
    */
   confirmBtns[0].onclick = function(){
       confirmEl.classList.remove("confirm-show");
       mask.style.display = "none";
       resolve && resolve();
   }
   // 取消
    confirmBtns[1].onclick = function(){
       confirmEl.classList.remove("confirm-show");
      mask.style.display = "none";
       reject && reject();
   }
 }

closConfirm.addEventListener('click',function(){
  confirmEl.classList.remove("confirm-show");
  mask.style.display = "none";
})
}
