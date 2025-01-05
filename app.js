function generateFields() {
    const count = parseInt(document.getElementById('questionCount').value);
    const errorMessage = document.getElementById('error-message');
    if (!count || count <= 0) {
        errorMessage.style.display = 'block';
        return;
    } else {
        errorMessage.style.display = 'none';
    }

    const container = document.getElementById('input-container');
    container.innerHTML = '<h1>Answer Notepad</h1>';

    for (let i = 1; i <= count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Answer ${i}`;
        input.id = `answer-${i}`;
        container.appendChild(input);
    }

    const button = document.createElement('button');
    button.textContent = 'Simplify Answers';
    button.onclick = displayAnswers;
    container.appendChild(button);
}

function displayAnswers() {
    const answerContainer = document.getElementById('answer-container');

    const inputs = document.querySelectorAll('#input-container input[type="text"]');
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';

    inputs.forEach((input, index) => {
        const answer = document.createElement('div');
        const answerText = document.createElement('span');
        const btnGroup = document.createElement('div');
        btnGroup.className = "btn-group";
        answerText.className = 'answer-text';
        answerText.textContent = `${index + 1}. ${input.value.trim() || 'No answer provided'}\n`;
        answer.className = 'answer-item';
        const correctBtn = document.createElement('button');
        const incorrectBtn = document.createElement('button');
        correctBtn.textContent = '✅';
        correctBtn.id = 'correct-btn';
        incorrectBtn.textContent = '❌';
        incorrectBtn.id = 'incorrect-btn';
        answer.appendChild(answerText);
        btnGroup.appendChild(correctBtn);
        btnGroup.appendChild(incorrectBtn);
        answer.appendChild(btnGroup);
        answersDiv.appendChild(answer);
    });
    let correctAns = 0;
    let incorrectAns = 0;

    const ansCounterDiv = document.createElement('div');
    ansCounterDiv.id = 'answer-counter';
    ansCounterDiv.textContent = `Total Answers: ${document.querySelectorAll('.btn-group').length}\n`;

    const correctCounter = document.createElement('p');
    correctCounter.className = 'correct-counter';
    correctCounter.textContent = "Correct: 0";
    const incorrectCounter = document.createElement('p');
    incorrectCounter.className = 'incorrect-counter';
    incorrectCounter.textContent = "Incorrect: 0";

    // Select all rows containing answers
    document.querySelectorAll('.btn-group').forEach((row) => {
        const correctBtn = row.querySelector('#correct-btn');
        const incorrectBtn = row.querySelector('#incorrect-btn');

        // Event listener for "correct" button
        correctBtn.addEventListener('click', (e) => {
            correctAns++;
            correctCounter.textContent = `Correct: ${correctAns}`;
            incorrectBtn.classList.add('disabled');
            correctBtn.classList.add('disabled');
        });

        // Event listener for "incorrect" button
        incorrectBtn.addEventListener('click', () => {
            incorrectAns++;
            incorrectCounter.textContent = `Incorrect: ${incorrectAns}`;
            correctBtn.classList.add('disabled');
            incorrectBtn.classList.add('disabled');
        });
    });

    ansCounterDiv.appendChild(correctCounter);
    ansCounterDiv.appendChild(incorrectCounter);
    answerContainer.appendChild(ansCounterDiv);

    const pdfBtn = document.createElement('button');
    pdfBtn.textContent = 'Download as PDF';
    answerContainer.appendChild(pdfBtn);
    const txtBtn = document.createElement('button');
    txtBtn.textContent = 'Download as TXT';
    answerContainer.appendChild(txtBtn);
    const cpyBtn = document.createElement('button');
    cpyBtn.textContent = 'Copy to Clipboard';
    answerContainer.appendChild(cpyBtn);

    document.getElementById('input-container').classList.add('hidden');
    document.getElementById('answer-container').classList.remove('hidden');

    let answersContent = document.getElementById("answers");
    // Clone the content of answersContent
    let tempContent = answersContent.cloneNode(true);

    // Remove all buttons from the cloned content
    let txtContentbuttons = tempContent.querySelectorAll("button");
    txtContentbuttons.forEach(button => button.remove());

    // Get the cleaned text content
    let exportValue = tempContent.innerText;

    txtBtn.addEventListener("click", () => {

        // Create the Blob and initiate the download
        let blobdtMIME = new Blob([exportValue], { type: "text/plain" });
        let url = URL.createObjectURL(blobdtMIME);
        let anele = document.createElement("a");
        anele.setAttribute("download", "answers.txt");
        anele.href = url;
        anele.click();
        console.log(blobdtMIME);
    });

    pdfBtn.addEventListener("click", () => {
        // Use jsPDF to create and download the PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(exportValue, 10, 10);
        doc.save("answers.pdf");
    });

    cpyBtn.addEventListener("click", () => {
        // Copy the text content
        navigator.clipboard.writeText(exportValue)
            .then(() => {
                alert("Text copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    });
}