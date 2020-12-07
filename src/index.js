const postForm = document.getElementById("post-form")
const postInput = document.getElementById("post-input")
const postList = document.getElementById("post-list")
const postURL = `http://localhost:3000/posts`
const commentURL = `http://localhost:3000/comments`

function fetchPosts(){
    fetch(postURL)
    .then(res => res.json())
    .then(posts => posts.forEach(data => renderPost(data.data)))
}

postForm.addEventListener("submit", submitPost)

function submitPost(){
    event.preventDefault()
    const configObj = {
        method: "POST", 
        headers: {
            "Content-type": "application/json", 
            "Accept": "application/json"
        }, 
        body: JSON.stringify({
            content: postInput.value
        })
    }

    fetch(postURL, configObj)
    .then(res => res.json())
    .then(data => renderPost(data.data))

}

// render post to dom
function renderPost(post){
    console.log(post)
    const li = document.createElement('li')
    li.dataset.id = post.id

    const p = document.createElement('p')
    p.innerText = post.attributes.content

    const deleteBtn = document.createElement("button")
    deleteBtn.innerText = "delete"
    deleteBtn.addEventListener("click", deletePost)

    const commentForm = document.createElement('form')
    commentForm.innerHTML += `<input type="text" id="comment-input"><input type="submit">`
    commentForm.addEventListener("submit", renderComment)

    const commentList = document.createElement('ul')
    post.attributes.comments.forEach(comment => {
        createComment(comment.content, post.id)
    })

    li.append(p, deleteBtn, commentForm, commentList)

    postList.appendChild(li)
    
    postForm.reset()
}

function deletePost(e){
    const postId = e.target.parentElement.dataset.id

    fetch(`${postURL}/${postId}`, {
        method: "DELETE"
    })

    e.target.parentElement.remove()
}

function renderComment(e){
    e.preventDefault()
    const commentInput = e.target.children[0].value
    const commentList = e.target.nextElementSibling
    const postId = e.target.parentElement.dataset.id

    createComment(commentInput, postId)
    submitComment(commentInput, postId)

    e.target.reset()
}

function createComment(commentInput, postId){
    const li = document.createElement('li')
    li.dataset.id = postId
    li.innerText = commentInput

    const deleteBtn = document.createElement('button')
    deleteBtn.innerText = "X"
    li.appendChild(deleteBtn)
    commentList.appendChild(li)

}

function submitComment(comment, postId){
    fetch(commentURL, {
        method: "POST",
        headers: {
            "Content-type": "application/json", 
            "Accept": "application/json"
        }, 
        body: JSON.stringify({
            content: comment, 
            post_id: postId
        })
    })
}



fetchPosts()