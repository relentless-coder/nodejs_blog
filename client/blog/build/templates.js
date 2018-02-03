(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['comment'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "    <div class=\"reply_comment\">\n        <h3 class=\"comment_name\"> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.author : depth0)) != null ? stack1.name : stack1), depth0))
    + " </h3>\n\n        <p class=\"comment_content\"> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.comment : stack1), depth0))
    + " </p>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"comment\" id=\""
    + alias4(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"parent_comment_wrapper\">\n        <h3 class=\"comment_name\">"
    + alias4(container.lambda(((stack1 = (depth0 != null ? depth0.author : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h3>\n        <p class=\"comment_content\">\n            "
    + ((stack1 = ((helper = (helper = helpers.comment || (depth0 != null ? depth0.comment : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"comment","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n        </p>\n    </div>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.comments : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    <div class=\"reply_comment_wrapper\">\n        <div class=\"comment_form_wrapper reply\">\n            <div class=\"name_email_wrapper reply\">\n                <input type=\"text\" id=\"reply_name\" class=\"new_name\" placeholder=\"Your name\"\n                       name=\"reply[author][name]\" required>\n                <input type=\"text\" id=\"reply_email\" class=\"new_email\" placeholder=\"Your email\"\n                       name=\"reply[author][email]\" required>\n            </div>\n            <textarea id=\"comment\" cols=\"10\" rows=\"5\" class=\"new_comment reply\" name=\"reply[comment]\"\n                      required></textarea>\n            <div class=\"reply_buttons_wrapper\">\n                <button onclick=\"commentWrapper.replyComment(reply, _id)\" class=\"submit_reply\">Submit</button>\n            </div>\n        </div>\n\n    </div>\n</div>\n";
},"useData":true});
templates['reply'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression;

  return "<div class=\"reply_comment\">\n    <h3 class=\"comment_name\">"
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.author : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h3>\n\n    <p class=\"comment_content\">"
    + alias1(((helper = (helper = helpers.comment || (depth0 != null ? depth0.comment : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"comment","hash":{},"data":data}) : helper)))
    + "</p>\n</div>";
},"useData":true});
})();
