// (function () {
//     'use strict'
  
//     var forms = document.querySelectorAll('.needs-validation')
  
//     Array.prototype.slice.call(forms)
//       .forEach(function (form) {
//         form.addEventListener('submit', function (event) {
//           if (!form.checkValidity()) {
//             event.preventDefault()
//             event.stopPropagation()
//           }
  
//           form.classList.add('was-validated')
//         }, false)
//       })
//   })()
//    // Basic form validation feedback
//    document.querySelector('form').addEventListener('submit', function(event) {
//     let formIsValid = true;
//     const inputs = document.querySelectorAll('input[required], textarea[required]');
//     inputs.forEach(input => {
//         const helpText = document.getElementById(input.id + 'Help');
//         if (!input.validity.valid) {
//             formIsValid = false;
//             helpText.classList.remove('hidden');
//             input.classList.add('border-red-500');
//         } else {
//             helpText.classList.add('hidden');
//             input.classList.remove('border-red-500');
//         }
//     });

//     if (!formIsValid) {
//         event.preventDefault();
//     }
// });
// Example starter JavaScript for disabling form submissions if there are invalid fields
// (function () {
//   'use strict'

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   var forms = document.querySelectorAll('.needs-validation')

//   // Loop over them and prevent submission
//   Array.prototype.slice.call(forms)
//     .forEach(function (form) {
//       form.addEventListener('submit', function (event) {
//         if (!form.checkValidity()) {
//           event.preventDefault()
//           event.stopPropagation()
//         }

//         form.classList.add('was-validated')
//       }, false)
//     })
// })()