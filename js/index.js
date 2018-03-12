class BaseCharacter {
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }
  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }  
  getHurt(damage) { 
    this.hp -= damage;
    if (this.hp <= 0) { 
      this.die();
    }

    var _this = this;
    var i = 1;

    //為什麼一定要用this不能直用DOM寫就好，而這邊的this又是指什麼？
    _this.id = setInterval(function() {
      
      if (i == 1) {
          _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
          _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
          _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
        }
        
        _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i +'.png';
        i++;

      if (i > 8) {
      _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
      _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
      _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
      clearInterval(_this.id);
      }

    }, 50);

  }
  die() {
    this.alive = false;
  }
  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%";
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);
    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;
    console.log("召喚英雄！" + this.name + "！");
  }
  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  getHurt(damage) {
    super.getHurt(damage);                              //沒有修改數值為什麼不用this就好
    this.updateHtml(this.hpElement, this.hurtElement);  //為什麼不用super繼承updateHtml
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);
    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;
    console.log("遇到怪獸了！ " + this.name + "！");
  }
  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 10);

//遊戲結束
function finish() {
  var dialog = document.getElementById("dialog")
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}

//回合計算
var rounds = document.getElementById("round-num").textContent  //回合限制功能區
function endTurn() {
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1) {
    finish();
  }
}

function monsterAttack() {
  setTimeout(function() {
    monster.element.classList.add("attacking");
    setTimeout(function() {
      monster.attack(hero);
      monster.element.classList.remove("attacking");
      if (hero.alive) {
        document.getElementsByClassName("skill-block")[0].style.display = "block";
        endTurn();
      }else {
        finish();
        }
    }, 500);
  }, 100);
}

function heroAttack() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function() {
    hero.element.classList.add("attacking");
    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
      if (monster.alive) {
        setTimeout(function(){
          monsterAttack()  
          },1100)
      }else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
          finish();
        }
      }, 500);
  }, 100);
}

function addSkillEvent() {            
  var skill = document.getElementById("skill");
  skill.onclick = function() { 
    heroAttack(); 
  }
}
addSkillEvent();