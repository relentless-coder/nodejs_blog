export const commentTemp = () => {
    return `
        <div class="comment" id="<%= comment._id %>">
    <div class="parent_comment_wrapper">
        <h3 class="comment_name"><%= comment.author.name %></h3>
        <div class="comment_content">
            <%- comment.comment %>
        </div>
    </div>
    <% if(comment.comments){ %>
    <% comment.comments.forEach((el)=>{ %>
    <div class="reply_comment">
        <h3 class="comment_name"> <%= el.author.name %> </h3>

        <div class="comment_content"> <%- el.comment %></div>
    </div>
    <% }) %>
    <% } %>

    <div class="reply_comment_wrapper">
        <div class="comment_form_wrapper reply">
            <div class="name_email_wrapper reply">
                <input type="text" id="reply_name" class="new_name" placeholder="Your name"
                       name="reply[author][name]" required>
                <input type="text" id="reply_email" class="new_email" placeholder="Your email"
                       name="reply[author][email]" required>
            </div>
            <textarea id="comment" cols="10" rows="5" class="new_comment reply" name="reply[comment]"
                      required></textarea>
            <div class="reply_buttons_wrapper">
                <button onclick="commentWrapper.replyComment(reply, _id)" class="submit_reply">Submit</button>
            </div>
        </div>

    </div>
</div>

    `
}