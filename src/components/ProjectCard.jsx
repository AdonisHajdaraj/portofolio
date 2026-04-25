function ProjectCard({ project }) {
  return (
    <div className="card h-100 shadow-sm border-0 project-card">
      <img src={project.image} className="card-img-top project-image" alt={project.title} />
      <div className="card-body d-flex flex-column">
        <h3 className="h5 card-title">{project.title}</h3>
        <p className="card-text text-secondary">{project.description}</p>
        <div className="mb-3">
          {project.tech.map((item) => (
            <span key={item} className="badge bg-secondary me-1 mb-1">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-auto">
          {project.deployed ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary w-100">
              Shiko Live
            </a>
          ) : (
            <button className="btn btn-outline-secondary w-100" disabled>
              Në zhvillim
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
