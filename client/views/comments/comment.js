import commentFactory from './comment.factory'

function comment() {
  const postComment = (url) => {
    console.log(document.getElementById('comment_name').value, document.getElementById('comment_email').value, document.getElementById('author_new_comment').value)
    const data = {
      author: {
        name: document.getElementById('comment_name').value,
        email: document.getElementById('comment_email').value
      },
      comment: document.getElementById('author_new_comment').value
    }
    commentFactory.postComment(data, url).then((data)=>{
      const commentWrapper = document.querySelector('.comment_wrapper');
      const result = Handlebars.templates['comment'](data.data);
      console.log(result)
      commentWrapper.insertAdjacentHTML('beforeend', result);
    })
  }

  const replyComment = (comment, id) => {
    commentFactory.replyComment(comment, id)
  }

  return {
    postComment, replyComment
  }
}

export {comment}

