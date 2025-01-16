### **AI DevSecOps Portal: Full Design Specification**

This specification defines the features and attributes of the DevSecOps AI Portal, incorporating the complete details for projects, services, microservices, deployment environments, templates, and visibility levels.

---

### **1. Web App Service (Node.js, Express, EJS)**

#### **1.1 Project Attributes**
A **Project** is the primary entity and includes the following attributes:

1. **GitLab URL**: URL of the repository or main project in GitLab.
2. **Project Name**: Name of the project.
3. **Description**: Brief description of the project.
4. **Project Status**: Status of the project (see Section 1.2 for status codes).
5. **Project Owner**: Name or ID of the project owner.
6. **Developers**: List of developers assigned to the project.
7. **Services**: Each project can have multiple services (see Section 2.1).
8. **Project Notes**:
    - Text input for general notes.
    - File upload functionality (maximum file size: **50MB**).
    - File storage is managed **locally**.
9. **CI/CD Specification**: Templates or files included in the GitLab CI pipeline (see Section 1.3).

---

#### **1.2 Project Status**
The project progresses through the following **status codes**:

- **0: DEVELOPMENT**
- **1: TESTING**
- **2: UAT**
- **3: CAB-APPROVAL**
- **4: PRODUCTION**

**Visibility Rules**:
- Deployment environments are visible in the "Add Deployment" list only if their **visibility level** is less than or equal to the current project status (see Section 3.1).

---

#### **1.3 CI/CD Specification**
Admin-defined templates or custom files can be included during project creation or updates. Examples of templates:
- **Security Scans** (e.g., SAST, DAST).
- **Static Scans**.
- **SmartBear Scanning**.
- Any additional template types as required.

---

### **2. Services and Microservices**

#### **2.1 Services**
Each project can have multiple services. Attributes of a service:
- **Service Name**: Name of the service.
- **Repository URL**: GitLab repository URL for the service.
- **Description**: Details about the service.
- **Microservices**: A service can contain multiple microservices (see Section 2.2).

---

#### **2.2 Microservices**
Each service can include multiple microservices. Microservice attributes:
- **Microservice Name**: Name of the microservice.
- **Description**: Description or purpose of the microservice.
- **Deployment Configurations**: Each microservice can be deployed to multiple environments (see Section 3.2).

---

### **3. Deployed Environments**

#### **3.1 Admin Feature: Add Deployment Environments**
Admins can add environments for deployment. The visibility level determines when the environment is accessible based on the project status.

##### **Attributes**:
- **Environment Name**: Name of the environment (e.g., Dev, UAT).
- **Cluster Name**: Kubernetes cluster name.
- **Cluster URL**: URL for Kubernetes API.
- **Namespace**: Kubernetes namespace.
- **Load Balancer URL**: External load balancer URL.
- **External Domain Name**: Fully qualified domain name (FQDN).
- **ECR URL**: AWS ECR repository URL for container images.
- **ECR Credentials**: Securely stored credentials for the repository.
- **Visibility Level**: Determines the minimum project status for environment visibility:
    - **0: DEVELOPMENT**
    - **1: TESTING**
    - **2: UAT**
    - **3: CAB-APPROVAL**
    - **4: PRODUCTION**

---

#### **3.2 Deployment Configurations for Microservices**
Each microservice can be deployed to multiple environments with environment-specific settings:

- **Namespace**: Kubernetes namespace.
- **Deployment Name**: Kubernetes deployment name.
- **Service Name**: Kubernetes service name.
- **External URL**: Publicly accessible URL.
- **Internal URL**: URL for intra-cluster communication.

**Rules**:
- Microservices can have different configurations for each environment.
- Deployment environments with higher visibility levels (> current project status) are hidden until the project status progresses.

---

### **4. Copilot Feature**

#### **4.1 Capabilities**
1. Query and retrieve project-specific information, such as:
    - GitLab repository details.
    - Deployment status for microservices.
    - Environment configurations.
2. Execute commands to check Kubernetes cluster status for:
    - Deployments.
    - Services.
    - Ingress rules.
    - Pods.
    - Namespaces.
3. Provide actionable recommendations, such as:
    - Auto-fix CI/CD pipeline errors.
    - Suggested improvements for deployment configurations.

---

### **5. Worker Service**

#### **5.1 Features**
1. Deploy Kubernetes manifest files to clusters.
2. Clone repositories from GitLab and modify or create `.gitlab-ci.yml` files based on templates or custom specifications.

---

### **6. AI Agent Service**

#### **6.1 Features**
1. Deployed with **LangFlow** or **Flowise**.
2. Offers:
    - Natural language explanations for recommendations.
    - Ability to handle API calls from the **Web App Service** or **Worker Service** to fetch information or execute commands.

---

### **7. User Interface**

#### **7.1 Project Details Page**
- **Tabs**:
    - **Overview**: Display project name, description, owner, and developers.
    - **Services**: List of all services and their microservices.
    - **Environments**: Available environments filtered based on visibility level.
    - **Notes**: Add/view notes and uploaded files.
    - **CI/CD**: Included templates and configurations.

#### **7.2 Add Deployment Environment (Admin)**
Admins can:
- Add all required fields for a new environment.
- Set a visibility level.

#### **7.3 Microservice Deployment Page**
- List environments where a microservice is deployed.
- Allow adding new deployments for eligible environments.

---

### **8. Summary of Key Features**
1. **Project Management**: Projects can contain multiple services, each with its own repository and microservices.
2. **Environment Visibility**: Deployment environments respect visibility levels based on project status.
3. **Copilot Integration**: Automates recommendations and retrieves project/Kubernetes data.
4. **Worker Service**: Facilitates CI/CD modifications and Kubernetes deployments.
5. **AI Agent Service**: Uses LangFlow/Flowise for intelligent recommendations and natural language processing.
 

 
