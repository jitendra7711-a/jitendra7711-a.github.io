export interface Project {
  name: string;
  category: string;
  description: string;
  tags: string[];
  url: string;
  visual: 'infrastructure' | 'pipeline' | 'observability';
}

// Public portfolio content. No credentials or private repository data belongs here.
export const profile = {
  name: 'Jitendra Patel',
  github: 'https://github.com/jitendra7711-a',
  email: '',
  linkedin: 'https://www.linkedin.com/in/jitendrapatel7711',
  technologies: ['Azure', 'AWS', 'Kubernetes', 'Docker', 'Terraform', 'Linux', 'GitHub Actions', 'Jenkins', 'Azure DevOps', 'Prometheus', 'Grafana', 'Git'],
  projects: [
    {
      name: 'AWS infrastructure as code',
      category: 'Infrastructure automation',
      description: 'An AWS provisioning study in Terraform: EC2 instances, key pairs, security groups, network rules, and EBS storage, all described in version-controlled HCL.',
      tags: ['Terraform', 'AWS', 'EC2', 'HCL'],
      url: 'https://github.com/jitendra7711-a/terraform-for-devops',
      visual: 'infrastructure',
    },
    {
      name: 'From commit to AKS',
      category: 'Cross-cloud CI/CD',
      description: 'A GitHub Actions pipeline that packages a Java application with Maven, builds and pushes its Docker image to Amazon ECR, and applies Kubernetes manifests to Azure AKS.',
      tags: ['GitHub Actions', 'Docker', 'Azure AKS', 'Amazon ECR'],
      url: 'https://github.com/jitendra7711-a/Github_actions_AKS',
      visual: 'pipeline',
    },
    {
      name: 'Container delivery on EKS',
      category: 'Kubernetes delivery',
      description: 'A delivery workflow connecting Maven, Docker, Amazon ECR, and EKS. A push to main builds the application, publishes its image, and restarts the Kubernetes deployment.',
      tags: ['AWS EKS', 'Docker', 'Maven', 'GitHub Actions'],
      url: 'https://github.com/jitendra7711-a/github_actions_eks',
      visual: 'observability',
    },
  ] as Project[],
};
