let jobs = [];
let editingId = null;

const form = document.querySelector("form");
const companyInput = document.querySelector("#company");
const roleInput = document.querySelector("#role");
const dateInput = document.querySelector("#date");
const statusInput = document.querySelector("#status");
const linkInput = document.querySelector("#link");
const notesInput = document.querySelector("#notes");
const submitBtn = document.querySelector(".btn-primary");
const jobList = document.querySelector("#jobList");
const searchInput = document.querySelector("#searchInput");
const filterSelect = document.querySelector("#filterStatus");

const storedJobs = localStorage.getItem("jobData");
if (storedJobs) {
  jobs = JSON.parse(storedJobs);
  renderJobs(jobs);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (editingId === null) {
    const job = {
      id: Date.now(),
      company: companyInput.value,
      role: roleInput.value,
      date: dateInput.value,
      status: statusInput.value,
      link: linkInput.value,
      notes: notesInput.value,
    };

    jobs.push(job);
  } else {
    const job = jobs.find(j => j.id === editingId);

    job.company = companyInput.value;
    job.role = roleInput.value;
    job.date = dateInput.value;
    job.status = statusInput.value;
    job.link = linkInput.value;
    job.notes = notesInput.value;

    editingId = null;
    submitBtn.textContent = "Add Application";
  }

  saveJobs();
  renderJobs(jobs);
  form.reset();
});

function createJobCard(job) {
  const card = document.createElement("div");
  card.className = "job-card";
  card.dataset.id = job.id;

  card.innerHTML = `
    <div class="job-card-header">
      <h3 class="company-name">${job.company}</h3>
      <span class="status ${job.status}">${job.status}</span>
    </div>
    <div class="job-details">
      <p><strong>Role:</strong> ${job.role}</p>
      <p><strong>Applied On:</strong> ${job.date}</p>
      <p><strong>Application Link:</strong>
        <a href="${job.link}" target="_blank">View Job</a>
      </p>
      <p><strong>Notes:</strong> ${job.notes}</p>
    </div>
    <div class="job-actions">
      <button class="btn-edit">Edit</button>
      <button class="btn-delete">Delete</button>
    </div>
  `;

  return card;
}

function renderJobs(list) {
  jobList.innerHTML = "";

  if (list.length === 0) {
    jobList.innerHTML = "<p>No applications found</p>";
    return;
  }

  list.forEach(job => {
    jobList.append(createJobCard(job));
  });
}

function saveJobs() {
  localStorage.setItem("jobData", JSON.stringify(jobs));
}

searchInput.addEventListener("input", applyFilters);
filterSelect.addEventListener("change", applyFilters);

function applyFilters() {
  const text = searchInput.value.toLowerCase();
  const status = filterSelect.value;

  const filtered = jobs.filter(job => {
    const matchesText =
      job.company.toLowerCase().includes(text) ||
      job.role.toLowerCase().includes(text);

    const matchesStatus =
      status === "All" || job.status === status;

    return matchesText && matchesStatus;
  });

  renderJobs(filtered);
}

jobList.addEventListener("click", (e) => {
  const card = e.target.closest(".job-card");
  if (!card) return;

  const id = Number(card.dataset.id);

  if (e.target.classList.contains("btn-edit")) {
    startEdit(id);
  }

  if (e.target.classList.contains("btn-delete")) {
    deleteJob(id);
  }
});

function startEdit(id) {
  const job = jobs.find(j => j.id === id);

  editingId = job.id;
  companyInput.value = job.company;
  roleInput.value = job.role;
  dateInput.value = job.date; 
  statusInput.value = job.status;
  linkInput.value = job.link;
  notesInput.value = job.notes;

  submitBtn.textContent = "Update Application";
}

function deleteJob(id) {
  jobs = jobs.filter(job => job.id !== id);
  saveJobs();
  renderJobs(jobs);
}
