import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");

generateTestUser(User);
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  class Tasks {
    constructor(taskString = null) {
      this.backlogTasks = taskString;
      this.readyTasks = taskString;
      this.inProgressTasks = taskString;
      this.finishedTasks = taskString;
      this.userid = login;
      this.writeBacklog = function (textString) {
        this.backlogTasks = JSON.parse(localStorage.getItem(this.userid + '-tasks-backlog') || "[]");
        if(typeof this.backlogTasks === 'string') this.backlogTasks=[this.backlogTasks];
        (this.backlogTasks).push(textString);
        localStorage.setItem(this.userid + '-tasks-backlog', JSON.stringify(this.backlogTasks));
        let readyItemCandidates=document.querySelector('.app-ready-items > .app-select__list > .app-selection-marker');
        let readyItemCandidateNewOpt=document.createElement('option');
        readyItemCandidateNewOpt.textContent=textString;
        readyItemCandidates.appendChild(readyItemCandidateNewOpt);
        document.querySelector('.app-container-ready>.append-button').disabled = false;
        redrawSelect('.app-ready-items');
        (document.querySelector('.app-ready-tasks-counter')).innerHTML=(this.backlogTasks).length;
      };
      this.writeReady = function (textString) {
        this.readyTasks = JSON.parse(localStorage.getItem(this.userid + '-tasks-ready') || "[]");
        if(typeof this.readyTasks === 'string') this.readyTasks=[this.readyTasks];
        (this.readyTasks).push(textString);
        localStorage.setItem(this.userid + '-tasks-ready', JSON.stringify(this.readyTasks));
        let inProgressItemCandidates=document.querySelector('.app-progress-items > .app-select__list > .app-selection-marker');
        let inProgressItemCandidateNewOpt=document.createElement('option');
        inProgressItemCandidateNewOpt.textContent=textString;
        inProgressItemCandidates.appendChild(inProgressItemCandidateNewOpt);
        document.querySelector('.app-container-progress>.append-button').disabled = false;
        this.removeFromBacklog(textString);
        redrawSelect('.app-ready-items');
        redrawSelect('.app-progress-items');
        // todo: real recalculate backlog content & if zero - then disble its own (ready) button
        (document.querySelector('.app-ready-tasks-counter')).innerHTML=this.backlogTasks.length;
      };
      this.writeInProgress = function (textString) {
        this.inProgressTasks = JSON.parse(localStorage.getItem(this.userid + '-tasks-in-progress') || "[]");
        if(typeof this.inProgressTasks === 'string') this.inProgressTasks=[this.inProgressTasks];
        (this.inProgressTasks).push(textString);
        localStorage.setItem(this.userid + '-tasks-in-progress', JSON.stringify(this.inProgressTasks));
        let inProgressItemCandidates=document.querySelector('.app-finished-items > .app-select__list > .app-selection-marker');
        let inProgressItemCandidateNewOpt=document.createElement('option');
        inProgressItemCandidateNewOpt.textContent=textString;
        inProgressItemCandidates.appendChild(inProgressItemCandidateNewOpt);
        document.querySelector('.app-container-finished>.append-button').disabled = false;
        this.removeFromReady(textString);
        redrawSelect('.app-progress-items');
        redrawSelect('.app-finished-items');
        // todo: real recalculate Ready content & if zero - then disble its own (ready) button
      };
      this.writeFinished = function (textString) {
        this.finishedTasks = JSON.parse(localStorage.getItem(this.userid + '-tasks-finished') || "[]");
        if(typeof this.finishedTasks === 'string') this.finishedTasks=[this.finishedTasks];
        (this.finishedTasks).push(textString);
        localStorage.setItem(this.userid + '-tasks-finished', JSON.stringify(this.finishedTasks));
        let finishedItemCandidates=document.querySelector('.app-finished-items > .app-select__list > .app-selection-marker');
        let finishedItemCandidateNewOpt=document.createElement('option');
        finishedItemCandidateNewOpt.textContent=textString;
        finishedItemCandidates.appendChild(finishedItemCandidateNewOpt);
        this.removeFromInProgress(textString);
        redrawSelect('.app-finished-items');
        // todo: real recalculate Ready content & if zero - then disble its own (ready) button
        (document.querySelector('.app-finished-tasks-counter')).innerHTML=(this.finishedTasks).length;
      };
      this.removeFromBacklog = function (textString) {
        this.backlogTasks=(this.backlogTasks).filter(item => item !== textString);
        localStorage.setItem(this.userid + '-tasks-backlog', JSON.stringify(this.backlogTasks));
      };
      this.removeFromReady = function (textString) {
        this.readyTasks=(this.readyTasks).filter(item => item !== textString);
        localStorage.setItem(this.userid + '-tasks-ready', JSON.stringify(this.readyTasks));
      };
      this.removeFromInProgress = function (textString) {
        this.inProgressTasks=(this.inProgressTasks).filter(item => item !== textString);
        localStorage.setItem(this.userid + '-tasks-in-progress', JSON.stringify(this.inProgressTasks));
      };
      this.removeFromFinished = function (textString) {
        this.finishedTasks=(this.finishedTasks).filter(item => item !== textString);
        localStorage.setItem(this.userid + '-tasks-in-progress', JSON.stringify(this.finishedTasks));
      };
      this.recall = function () {
        this.backlogTasks = JSON.parse(localStorage.getItem(this.userid + '-tasks-backlog') || "[]");
        this.readyTasks = JSON.parse(localStorage.getItem(this.userid + '-tasks-ready') || "[]");
        this.inProgressTasks = JSON.parse(localStorage.getItem(this.userid + '-tasks-in-progress') || "[]");
        this.finishedTasks = JSON.parse(localStorage.getItem(this.userid + '-tasks-finished') || "[]");

        // todo: create lists from this data.
      };
    }
  }

  let fieldHTMLContent = authUser(login, password)
    ? taskFieldTemplate
    : noAccessTemplate;

  document.querySelector("#content").innerHTML = fieldHTMLContent;
    if(!(fieldHTMLContent=='<h1>Sorry, you\'ve no access to this resource!</h1>')){
      document.title='Awesome Kanban board';
      const head=(document.getElementsByTagName("head"))[0];
      const icon = document.createElement("link");
      const backlogAddBtn=document.querySelector('.app-container-backlog > .append-button');
      const backlogSbmt=document.querySelector('.app-container-backlog > button.submit-button');
      const readyAddBtn=document.querySelector('.app-container-ready > .append-button');
      const readySbmt=document.querySelector('.app-container-ready > button.submit-button');
      const inProgressAddBtn=document.querySelector('.app-container-progress > .append-button');
      const inProgressSbmt=document.querySelector('.app-container-progress > button.submit-button');
      const finishedAddBtn=document.querySelector('.app-container-finished > .append-button');
      const finishedSbmt=document.querySelector('.app-container-finished > button.submit-button');
      const taskInputField=document.querySelector('.app-task-title_input');
      const backlogList=document.querySelector('.app-list__backlog');
      const readyList=document.querySelector('.app-list__ready');
      const inProgressList=document.querySelector('.app-list__in-progress');
      const finishedList=document.querySelector('.app-list__finished');
      const userMenuToggle=document.querySelector('.app-usermenu');
      const userMenu=document.querySelector('.app-menu__popup');

      let myTasks=new Tasks();

      icon.setAttribute('rel','icon');
      icon.setAttribute('href',"data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📝</text></svg>");
      head.appendChild(icon);
      document.querySelector('.app-ready-tasks-counter').innerHTML='0';
      document.querySelector('.app-finished-tasks-counter').innerHTML='0';
      userMenuToggle.addEventListener('click',function(){
        if(userMenu.style.visibility != 'visible'){
          userMenu.style.visibility='visible';
          userMenu.style.opacity=1;
          document.querySelector('.app-user_arrow').style.transform='rotate(180deg)';
        } else {
          document.querySelector('.app-user_arrow').style.transform='rotate(0deg)';
          userMenu.style.visibility='hidden';
          userMenu.style.opacity=0;
        }
      });

      backlogAddBtn.addEventListener('click',function(){
        startNewBacklogTask(backlogAddBtn,backlogSbmt,taskInputField);
      });
      taskInputField.addEventListener('keypress', function(event){
        if (event.key === 'Enter') {
          e.preventDefault();
          backlogSbmt.click();
        }
      });
      backlogSbmt.addEventListener('click',function(){
        addNewBacklogTask(backlogSbmt,backlogAddBtn,backlogList,taskInputField,myTasks);
      });
      readyAddBtn.addEventListener('click',function(){
        startNewReadyTask(readyAddBtn,readySbmt);
      });
      readySbmt.addEventListener('click',function(){
        addNewReadyTask(readySbmt,readyAddBtn,readyList,myTasks);
      });
      inProgressAddBtn.addEventListener('click',function(){
        startNewInProgressTask(inProgressAddBtn,inProgressSbmt);
      });
      inProgressSbmt.addEventListener('click',function(){
        addNewInProgressTask(inProgressSbmt,inProgressAddBtn,inProgressList,myTasks);
      });
     finishedAddBtn.addEventListener('click',function(){
       startNewFinishedTask(finishedAddBtn,finishedSbmt);
     });
     finishedSbmt.addEventListener('click',function(){
       addNewFinishedTask(finishedSbmt,finishedAddBtn,finishedList,myTasks);
     });
      document.addEventListener('click', closeAllSelect);
    }
});

//

function redrawSelect(select) {
  const x = document.querySelector(select).getElementsByClassName('app-select__list');
  const elemsToDel = document.querySelector(select).querySelectorAll('.select-selected, .select-hide');

  elemsToDel.forEach(el => el.remove());

  for (let i = 0; i < x.length; i++) {
    const selElmnt = x[i].getElementsByTagName("select")[0];
    const a = document.createElement('div');
    a.classList.add('select-selected');
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);

    const b = document.createElement('div');
    b.classList.add('select-items', 'select-hide');
    for (let j = 0; j < selElmnt.length; j++) {
      const c = document.createElement('div');
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener('click', function (e) {
        const s = this.parentNode.parentNode.querySelector('.app-selection-marker');
        const h = this.parentNode.previousSibling;
        for (let i = 0; i < s.options.length; i++) {
          if (s.options[i].innerHTML === this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            const y = this.parentNode.getElementsByClassName('same-as-selected');
            Array.from(y).forEach(el => el.removeAttribute('class'));
            this.classList.add('same-as-selected');
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);

    a.addEventListener('click', function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle('select-hide');
      this.classList.toggle('select-arrow-active');
    });
  }
}

function closeAllSelect(elmnt) {
  const x = document.getElementsByClassName('select-items');
  const y = document.getElementsByClassName('select-selected');

  Array.from(y).forEach(el => el.classList.remove('select-arrow-active'));

  for (let i = 0; i < x.length; i++) {
    if (x[i].parentNode !== elmnt.nextSibling) {
      x[i].classList.add('select-hide');
    }
  }
}



  function delLiWithContent(searchRoot, textcontent){
    let elem = document.evaluate('//li[contains(., "'+textcontent+'")]', searchRoot, null, XPathResult.ANY_TYPE, null );
    let thisElem = elem.iterateNext();
    let parentBtn=(thisElem.parentNode.parentNode.parentNode).querySelector('append-button');

    thisElem.remove();
  }
  function delDivWithContent(searchRoot, textcontent){
    let elem = document.evaluate('//div[contains(., "'+textcontent+'")]', searchRoot, null, XPathResult.ANY_TYPE, null );
    let thisElem = elem.iterateNext();
    thisElem.remove();
  }
  function delOptionWithContent(searchRoot, textcontent){
    let elem = document.evaluate('//option[contains(., "'+textcontent+'")]', searchRoot, null, XPathResult.ANY_TYPE, null );
    let thisElem = elem.iterateNext();
    thisElem.remove();
  }



  function addNewBacklogTask(sbmt, btn, backlogList, taskInputField, myTasks) {
    sbmt.style.display = 'none';
    btn.style.display = 'block';
  
    const newTaskAsListElement = document.createElement('li');
    newTaskAsListElement.textContent = taskInputField.value;
    backlogList.insertBefore(newTaskAsListElement, backlogList.firstElementChild);
  
    myTasks.writeBacklog(taskInputField.value);
    taskInputField.value = '';
    taskInputField.style.display = 'none';
    btn.focus();
  }
  
  function startNewBacklogTask(btn, sbmt, taskInputField) {
    btn.style.display = 'none';
    taskInputField.style.display = 'block';
    taskInputField.focus();
    sbmt.style.display = 'block';
  }

function addNewReadyTask(sbmt, btn, readyList, myTasks) {
  const selectMarker = document.querySelector('.app-progress-items > .app-select__list > .app-selection-marker');
  const selectedTask = document.querySelector('.app-ready-items > .app-select__list > .select-items > .same-as-selected');

  updateElementDisplay(sbmt, 'none');
  updateElementDisplay(btn, 'block');

  if (!selectedTask) {
    alert('Сначала выберите пункт из списка!');
    return;
  }

  const newReadyTaskText = selectedTask.innerText;
  const newTaskAsListElement = document.createElement('li');
  newTaskAsListElement.appendChild(document.createTextNode(newReadyTaskText));
  readyList.insertBefore(newTaskAsListElement, readyList.lastElementChild);

  myTasks.writeReady(newReadyTaskText);

  const nextSibling = selectedTask.nextSibling;
  const prevSibling = selectedTask.previousSibling;

  if (nextSibling) {
    nextSibling.classList.add('same-as-selected');
  } else if (prevSibling) {
    prevSibling.classList.add('same-as-selected');
  } else {
    btn.disabled = true;
  }

  selectedTask.remove();
  delLiWithContent(selectMarker, newReadyTaskText);
  delOptionWithContent(selectMarker, newReadyTaskText);
}

function startNewReadyTask(btn, sbmt) {
  updateElementDisplay(btn, 'none');
  updateElementDisplay(document.querySelector('.app-ready-items > .app-select__list > .select-selected'), 'block');
  updateElementDisplay(sbmt, 'block');
  sbmt.focus();
}

function addNewInProgressTask(sbmt, btn, inProgressList, myTasks) {
  const selectMarker = document.querySelector('.app-progress-items > .app-select__list > .app-selection-marker');
  const selectedTask = document.querySelector('.app-progress-items > .app-select__list > .select-items > .same-as-selected');

  updateElementDisplay(sbmt, 'none');
  updateElementDisplay(btn, 'block');

  if (!selectedTask) {
    alert('Сначала выберите пункт из списка!');
    return;
  }

  const newInProgressTaskText = selectedTask.innerText;
  const newTaskAsListElement = document.createElement('li');
  newTaskAsListElement.appendChild(document.createTextNode(newInProgressTaskText));
  inProgressList.insertBefore(newTaskAsListElement, inProgressList.lastElementChild);

  myTasks.writeInProgress(newInProgressTaskText);

  const nextSibling = selectedTask.nextSibling;
  const prevSibling = selectedTask.previousSibling;

  if (nextSibling) {
    nextSibling.classList.add('same-as-selected');
  } else if (prevSibling) {
    prevSibling.classList.add('same-as-selected');
  } else {
    btn.disabled = true;
  }

  delLiWithContent(document.querySelector('.app-ready-items > .app-select__list > .app-selection-marker'), newInProgressTaskText);
  delOptionWithContent(document.querySelector('.app-progress-items > .app-select__list > .app-selection-marker'), newInProgressTaskText);

  selectedTask.remove();
}

function startNewInProgressTask(btn, sbmt) {
  updateElementDisplay(btn, 'none');
  updateElementDisplay(document.querySelector('.app-progress-items > .app-select__list > .select-selected'), 'block');
  updateElementDisplay(sbmt, 'block');
  sbmt.focus();
}

function addNewFinishedTask(sbmt, btn, finishedList, myTasks) {
  const selectMarker = document.querySelector('.app-finished-items > .app-select__list > .app-selection-marker');
  const selectedTask = document.querySelector('.app-finished-items > .app-select__list > .select-items > .same-as-selected');

  updateElementDisplay(sbmt, 'none');
  updateElementDisplay(btn, 'block');

  if (!selectedTask) {
    alert('Сначала выберите пункт из списка!');
    return;
  }

  const newFinishedTaskText = selectedTask.innerText;
  const newTaskAsListElement = document.createElement('li');
  newTaskAsListElement.appendChild(document.createTextNode(newFinishedTaskText));
  finishedList.insertBefore(newTaskAsListElement, finishedList.lastElementChild);

  myTasks.writeFinished(newFinishedTaskText);

  const nextSibling = selectedTask.nextSibling;
  const prevSibling = selectedTask.previousSibling;

  if (nextSibling) {
    nextSibling.classList.add('same-as-selected');
  } else if (prevSibling) {
    prevSibling.classList.add('same-as-selected');
  } else {
    btn.disabled = true;
  }

  delLiWithContent(selectMarker, newFinishedTaskText);
  delOptionWithContent(selectMarker, newFinishedTaskText);

  selectedTask.remove();
}

// Вспомогательная функция для обновления отображения элемента
function updateElementDisplay(element, displayValue) {
  if (element) {
    element.style.display = displayValue;
  }
}

function startNewFinishedTask(btn, sbmt) {
  toggleElementDisplay(btn, 'none');
  toggleElementDisplay(document.querySelector('.app-finished-items > .app-select__list > .select-selected'), 'block');
  toggleElementDisplay(sbmt, 'block');
  sbmt.focus();
}

function recalcThings() {
  const tasksCounter = document.querySelector(".app-ready-tasks-counter");
  tasksCounter.textContent = '0';
}

// Вспомогательная функция для переключения отображения элемента
function toggleElementDisplay(element, displayValue) {
  if (element) {
    element.style.display = displayValue;
  }
}



