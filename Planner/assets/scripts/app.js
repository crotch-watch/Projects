const ACTIVE = "active";
const FINISHED = "finished";

const BUTTON_CAPTION = {
  [ACTIVE]: "Activate",
  [FINISHED]: "Finish",
};

class Helper {
  static switchDOMELement(project, newDesitnationSelector) {
    const projectElement = document.querySelector(`#${project.id}`);
    document.querySelector(newDesitnationSelector).append(projectElement);
  }
  static clearListeners(element) {
    if (!element) return element;
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }
}

class Component {
  host = document.body;
  #insertBefore;
  constructor(hostID, insertBefore = false) {
    if (hostID) this.host = document.getElementById(hostID);
    this.#insertBefore = insertBefore;
  }
  attach() {
    this.host.insertAdjacentElement(this.#insertBefore ? "afterbegin" : "beforeend", this.host);
  }
  detach() {
    if (this.element) this.element.remove();
  }
}

class Tooltip extends Component {
  element;
  create(text) {
    this.element = document.createElement("div");
    this.element.textContent = text || "Tooltip...";
    this.element.className = "card";
    this.element.addEventListener("click", this.detach.bind(this));
    this.attach();
    return this;
  }
  onClosetooltip(flushEffects) {
    flushEffects();
    return this;
  }
}

class ProjectItem {
  #item;
  #status;
  id;
  #switchProjectHandler;
  #switchButtonSelector = "button:last-of-type";
  #infoButtonSelector = "button:first-of-type";
  #hasActiveTooltip = false;
  constructor(item, status, switchProjectHandler) {
    this.#item = item;
    this.#status = status;
    this.id = this.#item.id;
    this.#switchProjectHandler = switchProjectHandler;
    this.showProjectInfo();
    this.#switchProjectStatus();
  }
  flushTooltipEffects() {
    this.#hasActiveTooltip = false;
  }
  showTooltip() {
    if (this.#hasActiveTooltip) return;
    const infoTooltip = new Tooltip();
    infoTooltip.create("HELLO");
    infoTooltip.onClosetooltip(this.flushTooltipEffects.bind(this));
    this.#hasActiveTooltip = true;
  }
  showProjectInfo() {
    const btn = this.#item.querySelector(this.#infoButtonSelector);
    btn.addEventListener("click", this.showTooltip.bind(this));
  }
  #switchProjectStatus() {
    this.#item = Helper.clearListeners(this.#item);
    const switchButton = this.#item.querySelector(this.#switchButtonSelector);
    switchButton.textContent = this.#status === ACTIVE ? BUTTON_CAPTION.finished : BUTTON_CAPTION.active;
    switchButton.addEventListener("click", this.#switchProjectHandler.bind(null, this.id));
  }
  updateEffects(newSwitchProjectHandler, status) {
    this.#switchProjectHandler = newSwitchProjectHandler;
    this.#switchProjectStatus(status);
  }
}

class ProjectList {
  #type;
  #projects = [];
  #ELEMENT_ID_SUFFIX = "-projects";
  #elementId;
  #DELETE_COUNT = 1;
  switchProjectHandler;
  constructor(type) {
    this.#type = type;
    this.#elementId = this.#type + this.#ELEMENT_ID_SUFFIX;
    this.#getProjectsFromDOM();
  }
  #getProjectsFromDOM() {
    const list = document.querySelectorAll(`#${this.#elementId} li`);
    if (!list.length) return;
    list.forEach((item) => this.#projects.push(new ProjectItem(item, this.#type, this.switchProject.bind(this))));
  }
  addProject(project) {
    project.status = this.#type;
    this.#projects.push(project);
    Helper.switchDOMELement(project, `#${this.#elementId} ul`);
    project.updateEffects(this.switchProject.bind(this), this.#type);
  }
  switchProject(id) {
    const startIndex = this.#projects.findIndex((project) => project.id === id);
    if (startIndex < 0) return;
    const [removedProject] = this.#projects.splice(startIndex, this.#DELETE_COUNT);
    this.switchProjectHandler(removedProject);
  }
  setSwitchProjectHandler(callbackFn) {
    this.switchProjectHandler = callbackFn;
  }
}

class App {
  static init() {
    const activeProjects = new ProjectList(ACTIVE);
    const finishedProjects = new ProjectList(FINISHED);
    activeProjects.setSwitchProjectHandler(finishedProjects.addProject.bind(finishedProjects));
    finishedProjects.setSwitchProjectHandler(activeProjects.addProject.bind(activeProjects));
  }
}

App.init();
