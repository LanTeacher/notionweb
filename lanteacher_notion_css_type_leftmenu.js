/* --- 공통 사용 시작 --- */
/* 하나 찾기, 엘리먼트 반환 */
const getEle = (ele, tar = document) => tar.querySelector(ele);
/* 전체 찾기, 엘리먼트 리스트 반환 */
const getEleAll = (eles, tar = document) => tar.querySelectorAll(eles);
/* block-id 찾아서 반환 */
const getBlockID = (obj, tar = document) => getEle(`div[data-block-id="${obj}"]`, tar);
/* block-id 리스트 입력, 리스트 반환 */
const getBlockIDs = (list, tar = document) => list.map(id => getBlockID(id, tar));
/* 블럭 숨기기, 리스트로 전달 */
function hideBlocks(blocks) {
    blocks.forEach(els => setClass(els, 'hide'));
}
/* 블럭 삭제, 리스트로 전달 */
function removeBlocks(blocks) {
    blocks.forEach(els => els.remove());
}
/* ID 지정 */
function setId(ele, id) {
    if (!!ele) ele.id = id;
}
/* class 지정 */
function setClass(ele, cls) {
    if (!!ele) ele.classList.add(cls);
}
/* class 삭제 */
function removeClass(ele, cls) {
    if (!!ele) ele.classList.remove(cls);
}
/* class 값 체크해서 true, false 리턴 */
const checkClass = (ele, cls) => ele.classList.contains(cls);
/* html 속성 삭제 */
function removeAttr(ele, attr) {
    if (typeof attr == 'object') attr.forEach(val => ele.removeAttribute(val));
    else ele.removeAttribute(attr);
}
/* html style 프로퍼티 삭제 */
function removeStyle(ele, prop) {
    if (typeof prop == 'object') prop.forEach(val => ele.style.removeProperty(val));
    else ele.style.removeProperty(prop);
}
/* --- 공통 사용 끝 ---  */
function setGnb(gnb) {
    /* 모바일 스크롤 */
    let menuTop = header.clientHeight + 7;
    const scrollFn = () => {
        if (!!gnb) {
            if (menuTop < gnb.offsetTop) {
                if (!checkClass(gnb, 'menu_shadow')) setClass(gnb, 'menu_shadow');
            } else {
                removeClass(gnb, 'menu_shadow');
            }
        }
    };
    window.addEventListener('load', () => {
        menuTop = header.clientHeight + 7;
        scrollFn()
    });
    window.addEventListener('scroll', scrollFn);
    window.addEventListener('resize', () => {
        menuTop = header.clientHeight + 7;
        scrollFn()
    });
};
function setSite() {
    /* style color 제거 */
    removeStyle(getEle('.notion-app-inner'), 'color');
    removeStyle(getEle('.notion-page-content'), 'color');
    /* 헤더 */
    const pageTitle = getEle('.page-title');
    const header = pageTitle.closest('.notion-scroller >div');
    setId(header, 'header');
    /* 갤러리뷰인 경우 class 추가 */
    getEleAll('.notion-gallery-view').forEach(ele => {
        setClass(ele.parentElement, 'notion_gallery_view');
    });
};
function setObserver(func = null) {
    const bodyCallback = (mutationList, observer) => {
        mutationList.forEach((ele, index) => {
            const obsTar = ele.target;
            /* GNB 찾기 */
            getEleAll('[class*="CodeBlock_block"]', obsTar).forEach(ele => {
                if (ele.firstChild.nodeName == 'NOTION') {
                    if (ele.firstChild.dataset.state == 'start') {
                        const eleArr = [];
                        const eleOpt = ele.firstChild.dataset;
                        let next = ele.nextSibling;
                        while (next.firstChild && next.firstChild.nodeName != 'NOTION') {
                            eleArr.push(next);
                            next = next.nextSibling;
                        }
                        next.remove();
                        const newDiv = document.createElement('div');
                        newDiv.dataset.create = 'create';
                        if (eleOpt.id) {
                            setId(newDiv, eleOpt.id)
                        };
                        if (eleOpt.class) {
                            setClass(newDiv, eleOpt.class)
                        };
                        eleArr.forEach(ele => {
                            newDiv.append(ele);
                        });
                        ele.after(newDiv);
                        ele.remove();
                    }
                    if (ele.firstChild.dataset.state == 'next') {
                        const eleTar = ele.firstChild;
                        const eleOpt = eleTar.dataset;
                        let target;
                        if (eleOpt.id) {
                            if (eleOpt.id == 'gnb' || eleOpt.id == 'contents') {
                                target = ele.parentElement.parentElement;
                                setId(target, eleOpt.id);
                                if (eleOpt.id == 'gnb') {
                                    setGnb(target);
                                    let gnbHeight = 24;
                                    target.querySelectorAll('[role="button"]').forEach(btn => {
                                        const parEle = btn.parentElement.parentElement;
                                        if (btn.firstChild.style.marginLeft != '0px') {
                                            parEle.remove();
                                        } else {
                                            gnbHeight += parEle.offsetHeight;
                                        }
                                    });
                                    target.style.height = gnbHeight + 'px';
                                }
                            } else {
                                target = ele.nextSibling;
                                setId(target, eleOpt.id)
                            }
                        };
                        if (eleOpt.class) {
                            if (eleOpt.id == 'gnb' || eleOpt.id == 'contents') {
                                target = ele.parentElement.parentElement;
                                setClass(target, eleOpt.class);
                            } else {
                                target = ele.nextSibling;
                                setClass(target, eleOpt.class);
                            }
                        };
                        target.dataset.create = 'append';
                        ele.remove();
                    }
                }
            });
            /* 제목 엘리먼트 이전 체크 */
            getEleAll('.notion-header-block', obsTar).forEach(ele => {
                if (!ele.previousElementSibling && ele.parentElement.dataset.create == 'create') {
                    setClass(ele.parentElement.previousElementSibling, 'prev_page_title');
                }
                if (!!ele.previousElementSibling && !checkClass(ele.previousElementSibling, 'prev_page_title') && !checkClass(ele.previousElementSibling, 'notion-header-block')) {
                    setClass(ele.previousElementSibling.dataset.create == 'create' ? ele.previousElementSibling.lastElementChild : ele.previousElementSibling, 'prev_page_title');
                }
            });
            if (func) {
                func(obsTar);
            };
        })
    };
    const bodyObserver = new MutationObserver(bodyCallback);
    bodyObserver.observe(document.querySelector('body'), { childList: true, subtree: true });
    /*const bodyTimer = setTimeout(()=>{
        bodyObserver.disconnect();
        console.log('body 감지 종료');
    },1000*50);*/
};
