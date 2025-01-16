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
        copilotInput.focus();
    });

    // Close copilot panel
    copilotClose.addEventListener('click', function() {
        copilotPanel.classList.remove('show');
        copilotToggle.style.display = 'flex';
    });

    // Handle message submission
    copilotForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const message = copilotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        copilotInput.value = '';

        try {
            const response = await fetch('/copilot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            if (data.success) {
                addMessage(data.response, 'copilot');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            addMessage('Sorry, I encountered an error. Please try again.', 'copilot');
            console.error('Copilot error:', error);
        }
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