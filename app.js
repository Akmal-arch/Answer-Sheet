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
        answerText.className = 'answer-text';
        answerText.textContent = `${index + 1}. ${input.value.trim() || 'No answer provided'}\n`;
        answer.className = 'answer-item';
        answer.appendChild(answerText);
        answersDiv.appendChild(answer);
    });

    const checkBtn = document.createElement('button');
    checkBtn.textContent = 'Check Answers';
    checkBtn.addEventListener('click', () => {
        const takeScrShotBtn = document.createElement('button');
        takeScrShotBtn.textContent = 'Download Image';
        //Function to make an image of specific element
        function screenshotAndCropElement(selector) {
            const element = document.querySelector(selector);
            if (!element) {
                console.error("Element not found");
                return;
            }

            html2canvas(element).then(canvas => {
                // Get the current canvas height
                const originalHeight = canvas.height;
                const cropHeight = 230;  // Height to crop from the bottom

                // Calculate the new height after cropping
                const newHeight = originalHeight - cropHeight;

                // Create a new canvas for the cropped image
                const croppedCanvas = document.createElement('canvas');
                const croppedContext = croppedCanvas.getContext('2d');

                // Set the dimensions of the new canvas
                croppedCanvas.width = canvas.width;
                croppedCanvas.height = newHeight;

                // Draw the cropped portion (excluding the bottom 120px) onto the new canvas
                croppedContext.drawImage(canvas, 0, 0, canvas.width, newHeight, 0, 0, canvas.width, newHeight);

                // Create a link to download the cropped image
                const link = document.createElement("a");
                link.download = "result.png";  // Name of the cropped image
                link.href = croppedCanvas.toDataURL();  // Convert the cropped canvas to data URL
                link.click();  // Trigger the download
            });
        }

        // Event listener for the button click
        takeScrShotBtn.addEventListener("click", function () {
            screenshotAndCropElement('#answer-container');
        });
        const cpyResultBtn = document.createElement('button');
        cpyResultBtn.textContent = 'Copy Results to Clipboard';
        cpyResultBtn.addEventListener('click', () => {
            let resultContent = ansCounterDiv;
            let tempResContent = resultContent.cloneNode(true);
            let resContentButtons = tempResContent.querySelectorAll("button");
            resContentButtons.forEach(button => button.remove());
            let exportResult = tempResContent.textContent;
            navigator.clipboard.writeText(exportResult)
                .then(() => {
                    alert("Results copied to clipboard!");
                })
                .catch((err) => {
                    console.error("Failed to copy text: ", err);
                });
        })
        const backBtn = document.createElement('button');
        backBtn.textContent = 'Back';
        backBtn.addEventListener('click', () => {
            ansCounterDiv.remove();
            backBtn.remove();
            dwnBtnGroup.classList.remove('hidden');
            answersDiv.innerHTML = '';
            inputs.forEach((input, index) => {
                const answer = document.createElement('div');
                const answerText = document.createElement('span');
                answerText.className = 'answer-text';
                answerText.textContent = `${index + 1}. ${input.value.trim() || 'No answer provided'}\n`;
                answer.className = 'answer-item';
                answer.appendChild(answerText);
                answersDiv.appendChild(answer);
            });
        })
        dwnBtnGroup.classList.add('hidden');
        let correctAns = 0;
        let incorrectAns = 0;
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
                correctCounter.textContent = `Correct: ${correctAns}\n`;
                incorrectBtn.classList.add('disabled');
                correctBtn.classList.add('half-disabled');
            });

            // Event listener for "incorrect" button
            incorrectBtn.addEventListener('click', () => {
                incorrectAns++;
                incorrectCounter.textContent = `Incorrect: ${incorrectAns}`;
                correctBtn.classList.add('disabled');
                incorrectBtn.classList.add('half-disabled');
            });
        });
        ansCounterDiv.appendChild(correctCounter);
        ansCounterDiv.appendChild(incorrectCounter);
        ansCounterDiv.appendChild(takeScrShotBtn)
        ansCounterDiv.appendChild(cpyResultBtn);
        ansCounterDiv.appendChild(backBtn)
        answerContainer.appendChild(ansCounterDiv);
    });
    const dwnBtnGroup = document.createElement('div');
    dwnBtnGroup.appendChild(checkBtn);
    const pdfBtn = document.createElement('button');
    pdfBtn.textContent = 'Download as PDF';
    dwnBtnGroup.appendChild(pdfBtn);
    const txtBtn = document.createElement('button');
    txtBtn.textContent = 'Download as TXT';
    dwnBtnGroup.appendChild(txtBtn);
    const cpyBtn = document.createElement('button');
    cpyBtn.textContent = 'Copy to Clipboard';
    dwnBtnGroup.appendChild(cpyBtn);
    answerContainer.appendChild(dwnBtnGroup);


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