$(document).ready(function() {
    let categories; // Define the categories variable outside the ajax function
    let percentageScore; // Define percentageScore as a global variable
    let wrongAnswers = []; // Define an array to store the questions the user got wrong
  
    // Load the quiz categories on the page
    $.ajax({
      url: "https://opentdb.com/api_category.php",
      method: "GET",
      success: function(response) {
        // Handle the response from the API
        categories = response.trivia_categories;
  
        // Add each category to the dropdown menu
        categories.forEach(function(category) {
          let option = $("<option>").attr("value", category.id).text(category.name);
          $("#category-select").append(option);
        });
      },
 // Add an event listener to the category dropdown menu
    $("#category-select").on("change", function() {
      // Get the selected category ID
      categoryId = $(this).val();

      // Clear any existing questions from the DOM
      $("main").empty();
  
      // Call the getQuestions function with the selected category ID
      getQuestions(categoryId);
    });
  
    function getQuestions(categoryId) {
      $.ajax({
        url: "https://opentdb.com/api.php",
        method: "GET",
        data: {
          amount: 10, // number of questions to retrieve
          category: categoryId, // ID of the selected category
          type: "multiple" // type of questions (multiple choice)
        },
        success: function(response) {
          // Handle the response from the API
          let questions = response.results;
 // Add each question to the DOM
          questions.forEach(function(question, index) {
            let questionDiv = $("<div>").addClass("question");
            let questionNumber = $("<h2>").text("Question " + (index + 1));
            let questionText = $("<p>").addClass("question-text").html(question.question);
            let answersList = $("<ul>").addClass("answers");
   // Add each answer to the answer list
            let answers = question.incorrect_answers.concat(question.correct_answer);
            answers.sort(); // Shuffle the answers so that the correct answer is not always last
            answers.forEach(function(answer) {
              let listItem = $("<li>");
              let radio = $("<input>").attr({
                type: "radio",
                name: "question-" + index,
                value: answer
              });
              let label = $("<label>").text(answer);
              listItem.append(radio).append(label);
  
              // If this is the correct answer, mark it with the data-correct attribute
             
              if (answer === question.correct_answer) 
              
              {radio.attr("data-correct", true);}
  
              answersList.append(listItem);
            });
  
            questionDiv.append(questionNumber).append(questionText).append(answersList);
            $("main").append(questionDiv);
          });
        },
