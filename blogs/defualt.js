function upload() {
    var problem = document.getElementById('problem').value;
    var solution = document.getElementById('solution').value;
    var image = document.getElementById('image').files[0];

    if (image) {
        var imageName = image.name;
        var storageRef = firebase.storage().ref('images/' + imageName);

        var uploadTask = storageRef.put(image);

        uploadTask.on(
            'state_changed',
            function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('upload is ' + progress + ' done');
            },
            function (error) {
                console.log(error.message);
                alert('Error while uploading');
            },
            function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    firebase
                        .database()
                        .ref('blogs/')
                        .push()
                        .set(
                            {
                                problem: problem,
                                solution: solution,
                                imageURL: downloadURL,
                            },
                            function (error) {
                                if (error) {
                                    alert('Error while uploading');
                                } else {
                                    alert('Successfully uploaded');
                                    document.getElementById('post-form').reset();
                                    getAndDisplayData(); // Display data only after successful upload
                                }
                            }
                        );
                });
            }
        );
    } else {
        firebase
            .database()
            .ref('blogs/')
            .push()
            .set(
                {
                    problem: problem,
                    solution: solution,
                },
                function (error) {
                    if (error) {
                        alert('Error while uploading');
                    } else {
                        alert('Successfully uploaded');
                        document.getElementById('post-form').reset();
                        getAndDisplayData(); // Display data only after successful upload
                    }
                }
            );
    }
}
// Function to get data and display it
function getAndDisplayData() {
    firebase.database().ref('blogs/').once('value').then(function(snapshot) {
        var posts_div = document.getElementById('posts');
        posts_div.innerHTML = "";

        var data = snapshot.val();
        
        if (data) {
            Object.entries(data).forEach(function([key, value]) {
                if (value.imageURL) {
                    posts_div.innerHTML += `<div class='col-sm-4 mt-2 mb-1'>
                                                <div class='card'>
                                                    <img src='${value.imageURL}' style='height:250px;'>
                                                    <div class='card-body'>
                                                        <p class='card-text'><strong>Problem:</strong> ${value.problem}</p>
                                                        <p class='card-text'><strong>Solution:</strong> ${value.solution}</p>
                                                        <button class='btn btn-danger' id='${key}' onclick='delete_post(this.id)'>Delete</button>
                                                    </div>
                                                </div>
                                            </div>`;
                } else {
                    posts_div.innerHTML += `<div class='col-sm-4 mt-2 mb-1'>
                                                <div class='card'>
                                                    <div class='card-body'>
                                                        <p class='card-text'><strong>Problem:</strong> ${value.problem}</p>
                                                        <p class='card-text'><strong>Solution:</strong> ${value.solution}</p>
                                                        <button class='btn btn-danger' id='${key}' onclick='delete_post(this.id)'>Delete</button>
                                                    </div>
                                                </div>
                                            </div>`;
                }
            });
        }
    });
}

// Call getAndDisplayData() on window load
window.onload = function() {
    getAndDisplayData();
};
// Function to delete a post
function delete_post(key) {
    firebase.database().ref('blogs/' + key).remove()
        .then(function () {
            // Post successfully deleted
            alert('Post deleted successfully');
            getAndDisplayData(); // Update the UI after deletion
        })
        .catch(function (error) {
            // An error occurred while deleting the post
            console.error('Error removing post: ', error);
            alert('Error while deleting the post');
        });
}

// Function to get data and display it
function getAndDisplayData() {
    firebase.database().ref('blogs/').once('value').then(function(snapshot) {
        var posts_div = document.getElementById('posts');
        posts_div.innerHTML = "";

        var data = snapshot.val();
        
        if (data) {
            Object.entries(data).forEach(function([key, value]) {
                if (value.imageURL) {
                    posts_div.innerHTML += `<div class='col-sm-4 mt-2 mb-1'>
                                                <div class='card'>
                                                    <img src='${value.imageURL}' style='height:250px;'>
                                                    <div class='card-body'>
                                                        <p class='card-text'><strong>Problem:</strong> ${value.problem}</p>
                                                        <p class='card-text'><strong>Solution:</strong> ${value.solution}</p>
                                                        <button class='btn btn-danger' id='${key}' onclick='delete_post(this.id)'>Delete</button>
                                                    </div>
                                                </div>
                                            </div>`;
                } else {
                    posts_div.innerHTML += `<div class='col-sm-4 mt-2 mb-1'>
                                                <div class='card'>
                                                    <div class='card-body'>
                                                        <p class='card-text'><strong>Problem:</strong> ${value.problem}</p>
                                                        <p class='card-text'><strong>Solution:</strong> ${value.solution}</p>
                                                        <button class='btn btn-danger' id='${key}' onclick='delete_post(this.id)'>Delete</button>
                                                    </div>
                                                </div>
                                            </div>`;
                }
            });
        }
    });
}

// Call getAndDisplayData() on window load
window.onload = function() {
    getAndDisplayData();
};

