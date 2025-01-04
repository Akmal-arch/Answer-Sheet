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
    const inputs = document.querySelectorAll('#input-container input[type="text"]');
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';

    inputs.forEach((input, index) => {
        const answer = document.createElement('span');
        answer.textContent = `${index + 1}. ${input.value.trim() || 'No answer provided'}`;
        answersDiv.appendChild(answer);
    });
    const answerContainer = document.getElementById('answer-container');
    const pdfBtn = document.createElement('button');
    pdfBtn.textContent = 'Download as PDF';
    pdfBtn.id = "pdfBtn";
    answerContainer.appendChild(pdfBtn);
    const txtBtn = document.createElement('button');
    txtBtn.textContent = 'Download as TXT';
    txtBtn.id = "txtBtn";
    answerContainer.appendChild(txtBtn);

    document.getElementById('input-container').classList.add('hidden');
    document.getElementById('answer-container').classList.remove('hidden');

    let answersContent = document.getElementById("answers");

    document.getElementById("txtBtn").addEventListener("click", () => {
        let valueinput = answersContent.innerText;
        let blobdtMIME = new Blob([valueinput], { type: "text/plain" });
        let url = URL.createObjectURL(blobdtMIME);
        let anele = document.createElement("a");
        anele.setAttribute("download", "answers.txt");
        anele.href = url;
        anele.click();
        console.log(blobdtMIME);
    });
    document.getElementById("pdfBtn").addEventListener("click", () => {
        let valueinput = answersContent.innerText;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(valueinput, 10, 10);
        doc.save("answers.pdf");
    });
}