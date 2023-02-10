/* 하나 찾기, 엘리먼트 반환 */
const getEle = (ele, tar = document) => tar.querySelector(ele);

/* 전체 찾기, 엘리먼트 리스트 반환 */
const getEleAll = (eles, tar = document) => tar.querySelectorAll(eles);

/* block-id 찾아서 반환 */
const getBlockID = obj => getEle(`div[data-block-id="${obj}"]`);

/* block-id 리스트 입력, 리스트 반환 */
const getBlockIDs = list => list.map(id=>getBlockID(id));

/* ID 지정 */
function setId(ele,id){
  if(!!ele) ele.id = id;
}

/* class 지정 */
function setClass(ele,cls){
  if(!!ele) ele.classList.add(cls);
}

/* class 삭제 */
function removeClass(ele,cls){
  if(!!ele) ele.classList.remove(cls);
}

/* class 값 체크해서 true, false 리턴 */
function checkClass(ele,cls){
  return ele.classList.contains(cls);
}

/* 메뉴 삭제 */
function removeMenu(targets, gnb){
  const gnbLinks = getEleAll('a',gnb);
  gnbLinks.forEach((ele,index)=>{
    if(targets.includes(index+1)){
      ele.parentElement.remove();
    }
  });
}

function setSite(gnbID, contentID, removeMenuNums){
  /* 헤더 */
  const pageTitle = getEle('.page-title');
  const header = pageTitle.closest('.notion-scroller >div');
  setId(header,'header');

  /* 컨텐츠 */
  const contBlock = getBlockID(contentID);
  if(!!contBlock) setId(contBlock.parentElement,'contents');

  /* 제목 엘리먼트 이전 체크 */
  getEleAll('.notion-header-block').forEach(ele=>{
    if(!!ele.previousElementSibling) setClass(ele.previousElementSibling,'prev_page_title');
  })

  /* 메뉴 */
  const gnb = getBlockID(gnbID);
  const topBarTitle = getEle('.notion-topbar >div >div:first-child');
  if(!!gnb){
    setId(gnb.parentElement,'gnb');
    removeMenu(removeMenuNums,gnb.parentElement);
  }
  /* 모바일 스크롤 */
  let menuTop = header.clientHeight + 7;
  const scrollFn = () => {
    if(!!gnb){
      const gnbTar = getEle('#gnb');
      if(menuTop < gnbTar.offsetTop){
        if(!checkClass(gnbTar,'menu_shadow')) setClass(gnbTar,'menu_shadow');
      }else{
        removeClass(gnbTar,'menu_shadow');
      }
    }
  };
  window.addEventListener('load', ()=>{
    menuTop = header.clientHeight + 7;
    scrollFn()
  });
  window.addEventListener('scroll', scrollFn);
  window.addEventListener('resize', ()=>{
    menuTop = header.clientHeight + 7;
    scrollFn()
  });

  /* 갤러리뷰인 경우 class 추가 */
  getEleAll('.notion-gallery-view').forEach(ele => {
    setClass(ele.parentElement,'notion_gallery_view');
  });
};