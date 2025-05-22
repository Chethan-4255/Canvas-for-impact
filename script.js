// Remove all slider-related code since we're not using it anymore
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });

    // Header scroll effect
    const header = document.querySelector('.site-header');
    const scrollWatcher = () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', scrollWatcher);

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Active nav link updater
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    const updateActiveNavLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNavLink);
    window.addEventListener('load', updateActiveNavLink);
});

// --- JOIN US FORM LOGIC (CONSOLIDATED) ---

document.addEventListener('DOMContentLoaded', function () {
  // --- CONFIG ---
  const formConfig = {
    googleFormId: '1FAIpQLSel7xXJ7xcZhl62CjPliYhnR1sGMBsi7hTrRW8y1dH5wzJVJg',
    questions: [
      { id: 'name', type: 'text', question: 'What is your name?', placeholder: 'Enter your full name', required: true, googleFormField: 'entry.2030634006' },
      { id: 'email', type: 'email', question: 'What is your email address?', placeholder: 'Enter your email address', required: true, googleFormField: 'entry.354139471' },
      { id: 'phone', type: 'tel', question: 'What is your contact number?', placeholder: 'Enter your contact number with country code', required: true, googleFormField: 'entry.2001412510' },
      { id: 'age', type: 'number', question: 'What is your age?', placeholder: 'Enter your age', required: true, googleFormField: 'entry.1690085722' },
      { id: 'role', type: 'select', question: 'Which role are you applying for?', required: true, options: [ { value: 'content-writing', label: 'Content Writing' }, { value: 'graphic-design', label: 'Graphic Design Intern' }, { value: 'human-resources', label: 'Human Resources' }, { value: 'illustration', label: 'Illustration' }, { value: 'web-development', label: 'Web Development' }, { value: 'video-editing', label: 'Video Editing' } ], googleFormField: 'entry.2018139653' },
      { id: 'experience', type: 'radio', question: 'Do you have prior experience in this field?', required: true, options: [ { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' } ], googleFormField: 'entry.597419836' },
      { id: 'portfolio', type: 'textarea', question: 'Attach your resume or provide links for your previous works', placeholder: 'Paste links to your portfolio, GitHub, LinkedIn, etc.', required: false, googleFormField: 'entry.909784826' },
      { id: 'agreement', type: 'checkbox', question: 'Do you agree to the following statement?', subtext: 'I understand that this is a voluntary, unpaid position and that my contributions will help support the mission of Canvas for Impact!', required: true, options: [ { value: 'agree', label: 'I agree' } ], googleFormField: 'entry.2133041505' }
    ],
    departmentLinks: {
      'content-writing': 'https://docs.google.com/document/d/1IHNg_OVi_sOEFEdkM58eIviX_u8op1DoNqqiFiYp9tI/edit?tab=t.0',
      'graphic-design': 'https://docs.google.com/document/d/1rVzc2hyHtppHFKhXh86NEK-Eh6A02aSrIvmWIwxVbuc/edit?tab=t.0',
      'human-resources': 'https://docs.google.com/document/d/1n8iCaj-LYaClWuYvOh2RphGI0bairiR44zWnpLM_OfU/edit?tab=t.0',
      'illustration': 'https://docs.google.com/document/d/1C3b8Is5ouZmW1qZW-MNZ-wEYjdlDC71VF18-6pHnMIU/edit?tab=t.0',
      'web-development': 'https://docs.google.com/document/d/1ZZWPjtBrv0I7qZ8ZEHrzfXCyB4sU1H3x7_zGMiXScts/edit?tab=t.0',
      'video-editing': 'https://docs.google.com/document/d/1f5Tng4gX8WpGHjemc-YOgP_bbaWQ-E9gR6ldrRyop8w/edit?tab=t.0'
    }
  };

  // --- VALIDATION ---
  function validateField(field, fieldConfig) {
    const value = field && field.value ? field.value.trim() : '';
    const errorElement = document.getElementById(`${fieldConfig.id}-error`);
    if (errorElement) errorElement.style.display = 'none';
    
    // Special case for radio buttons and checkboxes
    if (fieldConfig.type === 'radio') {
      const selectedRadio = document.querySelector(`input[name="${fieldConfig.id}"]:checked`);
      if (fieldConfig.required && !selectedRadio) {
        if (errorElement) { 
          errorElement.textContent = 'Please select an option'; 
          errorElement.style.display = 'block'; 
        }
        return false;
      }
      return true;
    }
    
    if (fieldConfig.type === 'checkbox') {
      const checkedBoxes = document.querySelectorAll(`input[name="${fieldConfig.id}"]:checked`);
      if (fieldConfig.required && checkedBoxes.length === 0) {
        if (errorElement) { 
          errorElement.textContent = 'Please check this box to continue'; 
          errorElement.style.display = 'block'; 
        }
        return false;
      }
      return true;
    }
    
    // For other field types
    if (!fieldConfig.required && value === '') return true;
    if (fieldConfig.required && value === '') {
      if (errorElement) { 
        errorElement.textContent = 'This field is required'; 
        errorElement.style.display = 'block'; 
      }
      return false;
    }
    
    switch (fieldConfig.type) {
      case 'email':
        if (!/^\S+@\S+\.\S+$/.test(value)) { 
          if (errorElement) { 
            errorElement.textContent = 'Please enter a valid email address'; 
            errorElement.style.display = 'block'; 
          } 
          return false; 
        }
        break;
      case 'tel':
        if (!/^\+?[0-9\s\-\(\)]{10,20}$/.test(value)) { 
          if (errorElement) { 
            errorElement.textContent = 'Please enter a valid phone number with country code'; 
            errorElement.style.display = 'block'; 
          } 
          return false; 
        }
        break;
      case 'number':
        if (isNaN(value) || parseInt(value) <= 0) { 
          if (errorElement) { 
            errorElement.textContent = 'Please enter a valid number'; 
            errorElement.style.display = 'block'; 
          } 
          return false; 
        }
        break;
    }
    return true;
  }
  function validateCurrentQuestion(currentIndex) {
    const currentQuestion = formConfig.questions[currentIndex];
    if (!currentQuestion) return true;
    const field = document.getElementById(currentQuestion.id);
    return validateField(field, currentQuestion);
  }
  function validateAllFields() {
    let isValid = true;
    formConfig.questions.forEach((question) => {
      const field = document.getElementById(question.id);
      if (!validateField(field, question)) isValid = false;
    });
    return isValid;
  }

  // --- FORM HANDLER ---
  function createQuestionScreens() {
    const form = document.getElementById('application-form');
    form.innerHTML = '';
    formConfig.questions.forEach((question, index) => {
      const questionScreen = document.createElement('div');
      questionScreen.classList.add('question-screen');
      questionScreen.id = `question-${index}`;
      questionScreen.dataset.questionId = question.id;
      
      // Add specific styling for role dropdown screen
      if (question.id === 'role') {
        questionScreen.classList.add('dropdown-screen');
      }
      
      let formGroupHTML = '';
      formGroupHTML += `<h2>${question.question}</h2>`;
      if (question.subtext) formGroupHTML += `<p>${question.subtext}</p>`;
      formGroupHTML += `<div class="form-group">`;
      switch (question.type) {
        case 'text': case 'email': case 'tel': case 'number':
          formGroupHTML += `<input type="${question.type}" id="${question.id}" name="${question.id}" placeholder="${question.placeholder || ''}" ${question.required ? 'required' : ''}>`;
          break;
        case 'textarea':
          formGroupHTML += `<textarea id="${question.id}" name="${question.id}" placeholder="${question.placeholder || ''}" rows="4" ${question.required ? 'required' : ''}></textarea>`;
          break;
        case 'select':
          formGroupHTML += `<select id="${question.id}" name="${question.id}" ${question.required ? 'required' : ''}>`;
          formGroupHTML += `<option value="" disabled selected>Please select an option</option>`;
          question.options.forEach(option => { formGroupHTML += `<option value="${option.value}">${option.label}</option>`; });
          formGroupHTML += `</select>`;
          if (question.id === 'role') {
            formGroupHTML += `<p class="help-text">First, select your role. Once selected, click the link below to view the specific requirements for that role. <a href="#" id="department-info-link" class="link">LINK</a>.</p>`;
          }
          break;
        case 'radio':
          formGroupHTML += `<div class="radio-group">`;
          question.options.forEach(option => {
            formGroupHTML += `<label class="radio-option"><input type="radio" name="${question.id}" value="${option.value}" ${question.required ? 'required' : ''}>${option.label}</label>`;
          });
          formGroupHTML += `</div>`;
          break;
        case 'checkbox':
          formGroupHTML += `<div class="checkbox-group">`;
          question.options.forEach(option => {
            formGroupHTML += `<label class="checkbox-option"><input type="checkbox" name="${question.id}" value="${option.value}" ${question.required ? 'required' : ''}>${option.label}</label>`;
          });
          formGroupHTML += `</div>`;
          break;
      }
      formGroupHTML += `<div id="${question.id}-error" class="error-message"></div>`;
      formGroupHTML += `</div>`;
      questionScreen.innerHTML = formGroupHTML;
      form.appendChild(questionScreen);
    });
    addSelectionListeners();
    addDropdownHandlers();
  }
  function addSelectionListeners() {
    // Radio options
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(option => {
      option.addEventListener('click', function() {
        const input = this.querySelector('input[type="radio"]');
        input.checked = true;
        const name = input.getAttribute('name');
        document.querySelectorAll(`.radio-option input[name="${name}"]`).forEach(radio => {
          radio.closest('.radio-option').classList.remove('selected');
        });
        this.classList.add('selected');
        
        // Clear any error messages when an option is selected
        const questionId = input.name;
        const errorElement = document.getElementById(`${questionId}-error`);
        if (errorElement) errorElement.style.display = 'none';
      });
    });
    
    // Direct input click handler for radio buttons
    const radioInputs = document.querySelectorAll('.radio-option input[type="radio"]');
    radioInputs.forEach(input => {
      input.addEventListener('change', function() {
        const name = this.getAttribute('name');
        document.querySelectorAll(`.radio-option input[name="${name}"]`).forEach(radio => {
          radio.closest('.radio-option').classList.remove('selected');
        });
        this.closest('.radio-option').classList.add('selected');
        
        // Clear any error messages
        const errorElement = document.getElementById(`${name}-error`);
        if (errorElement) errorElement.style.display = 'none';
      });
    });

    // Checkbox options
    const checkboxOptions = document.querySelectorAll('.checkbox-option');
    checkboxOptions.forEach(option => {
      option.addEventListener('click', function(e) {
        if (e.target.type !== 'checkbox') {
          const input = this.querySelector('input[type="checkbox"]');
          input.checked = !input.checked;
        }
        const input = this.querySelector('input[type="checkbox"]');
        if (input.checked) {
          this.classList.add('selected');
        } else {
          this.classList.remove('selected');
        }
        
        // Clear any error messages when an option is selected
        const questionId = input.name;
        const errorElement = document.getElementById(`${questionId}-error`);
        if (errorElement) errorElement.style.display = 'none';
      });
    });
  }
  function updateProgressBar(currentIndex, totalQuestions) {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
  }
  function showQuestion(index) {
    document.querySelectorAll('.question-screen').forEach(q => { q.classList.remove('active'); });
    const screen = document.getElementById(`question-${index}`);
    if (screen) {
      screen.classList.add('active');
      animateFormElements(screen);
    }
    updateProgressBar(index, formConfig.questions.length);
    updateNavigationButtons(index);
  }
  function updateNavigationButtons(index) {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
    nextBtn.style.display = (index < formConfig.questions.length - 1) ? 'inline-flex' : 'none';
    submitBtn.style.display = (index === formConfig.questions.length - 1) ? 'inline-flex' : 'none';
  }
  function goToNextQuestion(currentIndex) {
    if (currentIndex < formConfig.questions.length - 1) {
      showQuestion(currentIndex + 1);
      return currentIndex + 1;
    }
    return currentIndex;
  }
  function goToPreviousQuestion(currentIndex) {
    if (currentIndex > 0) {
      showQuestion(currentIndex - 1);
      return currentIndex - 1;
    }
    return currentIndex;
  }
  function showThankYouScreen() {
    document.querySelectorAll('.question-screen').forEach(q => q.classList.remove('active'));
    document.getElementById('thank-you').classList.add('active');
    document.querySelector('.navigation-buttons').style.display = 'none';
    document.getElementById('progress-bar').style.width = '100%';
  }
  function showIntroScreen() {
    document.getElementById('intro').classList.add('active');
    document.querySelectorAll('.question-screen').forEach(q => q.classList.remove('active'));
    document.getElementById('thank-you').classList.remove('active');
    document.querySelector('.navigation-buttons').style.display = 'none';
    document.getElementById('progress-bar').style.width = '0%';
  }

  // --- ANIMATIONS ---
  function animateElement(element, animationClass, delay = 0) {
    if (!element) return;
    setTimeout(() => {
      element.classList.add(animationClass);
      setTimeout(() => { element.classList.remove(animationClass); }, 1000 + delay);
    }, delay);
  }
  function animateTransition(fromElement, toElement, isForward = true) {
    if (!fromElement || !toElement) return;
    fromElement.classList.add(isForward ? 'fade-out' : 'slide-out-right');
    setTimeout(() => {
      fromElement.classList.remove('active');
      fromElement.classList.remove(isForward ? 'fade-out' : 'slide-out-right');
      toElement.classList.add('active');
      toElement.classList.add(isForward ? 'slide-in-right' : 'slide-in-left');
      setTimeout(() => { toElement.classList.remove(isForward ? 'slide-in-right' : 'slide-in-left'); }, 500);
    }, 500);
  }
  function animateFormElements(container) {
    if (!container) return;
    const elements = container.querySelectorAll('h2, p, .form-group, input, select, textarea, .radio-group, .checkbox-group');
    elements.forEach((element, index) => {
      const delay = 100 + (index * 100);
      element.style.opacity = '0';
      setTimeout(() => {
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, delay);
    });
  }
  function typeText(element, text, speed = 50) {
    if (!element) return;
    element.textContent = '';
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typing);
      }
    }, speed);
  }

  // --- FORM SUBMISSION ---
  function collectFormData() {
    const formData = {};
    formConfig.questions.forEach(question => {
      const field = document.getElementById(question.id);
      if (!field) return;
      switch (question.type) {
        case 'checkbox':
          const checkedBoxes = document.querySelectorAll(`input[name="${question.id}"]:checked`);
          formData[question.id] = Array.from(checkedBoxes).map(box => box.value).join(', ');
          break;
        case 'radio':
          const selectedRadio = document.querySelector(`input[name="${question.id}"]:checked`);
          formData[question.id] = selectedRadio ? selectedRadio.value : '';
          break;
        default:
          formData[question.id] = field.value.trim();
      }
    });
    return formData;
  }
  function mapToGoogleForm(formData) {
    const params = new URLSearchParams();
    formConfig.questions.forEach(question => {
      if (question.googleFormField && formData[question.id] !== undefined) {
        params.append(question.googleFormField, formData[question.id]);
      }
    });
    return params;
  }
  async function submitToGoogleForm(formData) {
    try {
      const params = mapToGoogleForm(formData);
      const googleFormUrl = `https://docs.google.com/forms/d/e/${formConfig.googleFormId}/formResponse`;
      // For development/testing, log the data that would be sent
      // console.log('Form data to be submitted:', formData);
      // console.log('Google Form params:', Object.fromEntries(params.entries()));
      // In production, you would use fetch to submit the form
      // However, due to CORS restrictions, a direct fetch won't work
      // So we'll create a hidden iframe to submit the form instead
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = googleFormUrl;
      form.target = 'hidden-iframe';
      form.style.display = 'none';
      for (const [key, value] of params.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      form.submit();
      return new Promise(resolve => {
        setTimeout(() => {
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          resolve({ success: true });
        }, 2000);
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // --- MAIN ---
  let currentQuestionIndex = 0;
  const startBtn = document.getElementById('start-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const applicationForm = document.getElementById('application-form');

  function initializeForm() {
    createQuestionScreens();
    document.querySelector('.navigation-buttons').style.display = 'none';
    startBtn.addEventListener('click', () => {
      document.getElementById('intro').classList.remove('active');
      showQuestion(0);
      document.querySelector('.navigation-buttons').style.display = 'flex';
    });
    prevBtn.addEventListener('click', () => {
      const currentScreen = document.getElementById(`question-${currentQuestionIndex}`);
      const prevScreen = document.getElementById(`question-${currentQuestionIndex - 1}`);
      animateTransition(currentScreen, prevScreen, false);
      currentQuestionIndex = goToPreviousQuestion(currentQuestionIndex);
    });
    nextBtn.addEventListener('click', () => {
      const currentScreen = document.getElementById(`question-${currentQuestionIndex}`);
      const nextScreen = document.getElementById(`question-${currentQuestionIndex + 1}`);
      if (validateCurrentQuestion(currentQuestionIndex)) {
        animateTransition(currentScreen, nextScreen, true);
        currentQuestionIndex = goToNextQuestion(currentQuestionIndex);
      } else {
        const formGroup = currentScreen.querySelector('.form-group');
        formGroup.classList.add('shake');
        setTimeout(() => { formGroup.classList.remove('shake'); }, 500);
      }
    });
    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!validateCurrentQuestion(currentQuestionIndex)) return;
      if (!validateAllFields()) {
        alert('Please fill in all required fields before submitting.');
        return;
      }
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting...';
      const formData = collectFormData();
      const result = await submitToGoogleForm(formData);
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Submit';
      if (result.success) {
        showThankYouScreen();
      } else {
        alert('There was an error submitting your application. Please try again later.');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (!document.querySelector('.question-screen.active')) return;
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (currentQuestionIndex === formConfig.questions.length - 1) {
          submitBtn.click();
        } else {
          nextBtn.click();
        }
      }
    });
  }
  initializeForm();
  document.body.classList.add('loaded');
  // Add animation for shake effect
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .shake { animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
    </style>
  `);

  // Add separate function for dropdown handlers
  function addDropdownHandlers() {
    document.addEventListener('click', function(e) {
      if (e.target && e.target.id === 'department-info-link') {
        e.preventDefault();
        const roleSelect = document.getElementById('role');
        const selectedRole = roleSelect.value;
        if (selectedRole && formConfig.departmentLinks[selectedRole]) {
          window.open(formConfig.departmentLinks[selectedRole], '_blank');
        } else {
          alert('Please select a role first to view its information.');
        }
      }
    });
    
    // Add change handler for select elements
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
      select.addEventListener('change', function() {
        // Clear any error messages when an option is selected
        const questionId = this.id;
        const errorElement = document.getElementById(`${questionId}-error`);
        if (errorElement) errorElement.style.display = 'none';
      });
    });
  }
}); 