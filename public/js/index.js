const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('.fileInput');
const browseBtn = document.querySelector('.browseBtn');
const bgProgress = document.querySelector('.bg-progress')
const percentage = document.querySelector('#percent');
const progressLine = document.querySelector('.progress-line');
const progressContainer = document.querySelector('.progress-container');
const linkContainer = document.querySelector('.link-container');
const linkInputField = document.querySelector('.link-input');
const copyBtn = document.querySelector('#copyBtn');
const uploadURL = `/api/files`;
const emailURL = '/api/files/send';

const emailSubmitBtn = document.querySelector('.submit-email-btn');
const emailForm = document.querySelector('.email-form');
const toaster = document.querySelector('.toaster');


dropZone.addEventListener('dragover' , e => {
  e.preventDefault();
   if(!dropZone.classList.contains('dragged')){
     dropZone.classList.add('dragged');
   }
});

dropZone.addEventListener('dragleave' , e =>{
  e.preventDefault();
  dropZone.classList.remove('dragged');
});

browseBtn.addEventListener('click' , () =>{
  fileInput.click();
});



dropZone.addEventListener('drop' , (e) =>{
  e.preventDefault();
  dropZone.classList.remove('dragged');
  const files = e.dataTransfer.files;
  if(files.length){
    fileInput.files = files;
    uploadFile();
  }

});

function uploadFile (){
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("myFile" , file);
  const xhr = new XMLHttpRequest;

  // handle error
  xhr.upload.onerror = function () {
    showToaster(`Error in upload`);
    fileInput.value = ""; // reset the input
  };

  xhr.onreadystatechange = () =>{
    if(xhr.readyState === XMLHttpRequest.DONE){
      showLinkContainer(JSON.parse(xhr.response));
    }
  }

  xhr.upload.onprogress = updateProgress;
  xhr.open('POST', uploadURL );
  xhr.send(formData);
  
}

fileInput.addEventListener('change' , (e) =>{
  uploadFile();
})

const updateProgress = (e) =>{

  progressContainer.style.display = 'block';
  const uploadPercent = Math.round((e.loaded / e.total) * 100 );
  bgProgress.style.width = `${uploadPercent}%`;
  percentage.innerText = `${uploadPercent}%`;
  progressLine.style.width = uploadPercent - 4 + "%";

}

const showLinkContainer = ({file}) =>{
  emailSubmitBtn.removeAttribute('disabled');
  progressContainer.style.display = 'none';
  linkContainer.style.display = 'block';
  linkInputField.value = file;
}

copyBtn.addEventListener('click' , () =>{
  linkInputField.select();
  document.execCommand('copy');
  showToaster('Link copied successfully!')
});

emailForm.addEventListener('submit' , (e) =>{
  e.preventDefault();
  emailSubmitBtn.setAttribute('disabled' , 'true');
  emailSubmitBtn.innerText = 'Sending...';
  const uuid = linkInputField.value.split('/').slice(-1)[0];
  const formData = {
    uuid : uuid ,
    emailFrom : emailForm.elements["emailFrom"].value ,
    emailTo : emailForm.elements["emailTo"].value 
  }
  
  fetch(emailURL , {
    method : "POST" , 
    headers : {
      "Content-Type" : 'application/json'
    } ,
    body : JSON.stringify(formData)
  }).then(res => res.json() )
  .then(result => {

    if(result.status === 200){
        linkContainer.style.display = 'none';
        emailSubmitBtn.innerText = 'Send';
        showToaster(result.message);
        emailForm.elements["emailFrom"].value ="";
        emailForm.elements["emailTo"].value ="";
        resetLinkInputField();
        fileInput.value = "";
    }

  });


});


let toastTimer;
function showToaster (msg){

  clearInterval(toastTimer);
  toaster.innerText = msg;
  toaster.classList.add('showToaster');
  toastTimer = setTimeout(() =>{
    toaster.classList.remove('showToaster');
  }, 2000)

}
 
function resetLinkInputField (){
  linkInputField.value = "";
}