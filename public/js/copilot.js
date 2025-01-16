document.addEventListener('DOMContentLoaded', function() {
    const copilotToggle = document.getElementById('copilotToggle');
    const copilotPanel = document.getElementById('copilotPanel');
    const copilotClose = document.getElementById('copilotClose');
    const copilotForm = document.getElementById('copilotForm');
    const copilotInput = document.getElementById('copilotInput');
    const copilotMessages = document.getElementById('copilotMessages');

    // Toggle copilot panel
    copilotToggle.addEventListener('click', function() {
        copilotPanel.classList.add('show');
        copilotToggle.style.display = 'none';
    });

    // Close copilot panel
    copilotClose.addEventListener('click', function() {
        copilotPanel.classList.remove('show');
        copilotToggle.style.display = 'block';
    });

    // Handle message submission
    copilotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = copilotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        copilotInput.value = '';

        // Simulate copilot response
        setTimeout(() => {
            addMessage('I received your message: ' + message, 'copilot');
        }, 1000);
    });

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';

        const avatar = document.createElement('i');
        avatar.className = type === 'user' ? 
            'fas fa-user message-avatar' : 
            'fas fa-robot message-avatar';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;

        content.appendChild(avatar);
        content.appendChild(bubble);
        messageDiv.appendChild(content);
        copilotMessages.appendChild(messageDiv);

        // Scroll to bottom
        copilotMessages.scrollTop = copilotMessages.scrollHeight;
    }
});