export const replyTemp = () => {
    return `<div class="reply_comment">
    <h3 class="comment_name"><%= comment.author.name%></h3>

    <div class="comment_content"><p><%=comment.comment%></p></div>
</div>`
};