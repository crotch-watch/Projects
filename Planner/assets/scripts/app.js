class Tooltip {}

class ProjectItem {
  #id;
  #status;
  #item;
  constructor(item, status) {
    this.#item = item;
    this.#status = status;
    this.#id = this.#item.id;
    this.#switchProjectStatus();
  }
  #switchProjectStatus() {
    this.#item
      .querySelector("button:last-of-type")
      .addEventListener("click", console.log);
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
      this.#projects.push(new ProjectItem(item, this.#type))
    );
  }
  switchProject(id) {
    const startIndex = this.#projects.findIndex((project) => project.id === id);
    const [switchThisProject] = this.#projects.splice(
      startIndex,
      this.#DELETE_COUNT
    );
    this.switchProjectHandler();
  }
  setSwitchProjectHandler(callbackFn) {
    this.switchProjectHandler(callbackFn);
  }
}

class App {
  static init() {
    const activeProjects = new ProjectList("active");
    const finishedProjects = new ProjectList("finished");
    activeProjects.setSwitchProjectHandler(
      finishedProjects.switchProject.bind(finishedProjects)
    );
    finishedProjects.setSwitchProjectHandler(
      activeProjects.switchProject.bind(finishedProjects)
    );
  }
}

App.init();
