class Tooltip {}

class ProjectItem {
  id;
  #status;
  #item;
  #switchProjectHandler;
  constructor(item, status, switchProjectHandler) {
    this.#item = item;
    this.#status = status;
    this.id = this.#item.id;
    this.#switchProjectHandler = switchProjectHandler;
    this.#switchProjectStatus();
  }
  #switchProjectStatus() {
    this.#item.querySelector("button:last-of-type").addEventListener("click", this.#switchProjectHandler);
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
    list.forEach((item) =>
      this.#projects.push(new ProjectItem(item, this.#type, this.switchProject.bind(this, item.id)))
    );
  }
  addProject(project) {
    console.log(this);
  }
  switchProject(id) {
    const startIndex = this.#projects.findIndex((project) => project.id === id);
    const [removedProject] = this.#projects.splice(startIndex, this.#DELETE_COUNT);
    this.switchProjectHandler(removedProject);
  }
  setSwitchProjectHandler(callbackFn) {
    this.switchProjectHandler = callbackFn;
  }
}

class App {
  static #categories = {
    ACTIVE: "active",
    FINISHED: "finished",
  };
  static init() {
    const activeProjects = new ProjectList(this.#categories.ACTIVE);
    const finishedProjects = new ProjectList(this.#categories.FINISHED);
    activeProjects.setSwitchProjectHandler(finishedProjects.addProject.bind(finishedProjects));
    finishedProjects.setSwitchProjectHandler(activeProjects.addProject.bind(activeProjects));
  }
}

App.init();
