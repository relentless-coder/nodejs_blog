import commentFactory from './comment.factory'

function comment() {
    const postComment = (comment, url)=>{
      commentFactory.postComment(comment, url)
    }

    const replyComment = (comment, id)=>{
      commentFactory.replyComment(comment, id)
    }

}

export {comment}