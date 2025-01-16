document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    const form = document.getElementById('projectForm');

    // Form Validation
    function validateForm() {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData(form);
            const projectData = {
                projectName: formData.get('projectName'),
                description: formData.get('description'),
                developers: Array.from(document.getElementById('developers').selectedOptions).map(opt => opt.value),
                projectStatus: 0 // Default to DEVELOPMENT
            };

            try {
                const response = await fetch('/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(projectData)
                });

                const data = await response.json();
                if (data.success) {
                    window.location.href = `/projects/${data.project.uuid}`;
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error creating project:', error);
                alert('Failed to create project. Please try again.');
            }
        }
    });
});