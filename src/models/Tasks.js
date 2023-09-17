

export class Tasks {
    constructor(login, taskString = null) {
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

  export function closeAllSelect(elmnt) {
    const x = document.getElementsByClassName('select-items');
    const y = document.getElementsByClassName('select-selected');
  
    Array.from(y).forEach(el => el.classList.remove('select-arrow-active'));
  
    for (let i = 0; i < x.length; i++) {
      if (x[i].parentNode !== elmnt.nextSibling) {
        x[i].classList.add('select-hide');
      }
    }
  }