define(function(require, exports, module) {

    var dom = require("ace/lib/dom").dom;

    var cssText = ".ace-clouds .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
\
.ace-clouds .ace_editor.ace_focus {\
  border: 2px solid #327fbd;\
}\
\
.ace-clouds .ace_gutter {\
  width: 50px;\
  background: #e8e8e8;\
  color: #333;\
  overflow : hidden;\
}\
\
.ace-clouds .ace_gutter-layer {\
  width: 100%;\
  text-align: right;\
}\
\
.ace-clouds .ace_gutter-layer .ace_gutter-cell {\
  padding-right: 6px;\
}\
\
.ace-clouds .ace_editor .ace_printMargin {\
  width: 1px;\
  background: #e8e8e8;\
}\
\
.ace-clouds .ace_scroller {\
  background-color: #FFFFFF;\
}\
\
.ace-clouds .ace_text-layer {\
  cursor: text;\
  color: #000000;\
}\
\
.ace-clouds .ace_cursor {\
  border-left: 2px solid #000000;\
}\
\
.ace-clouds .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid #000000;\
}\
 \
.ace-clouds .ace_marker-layer .ace_selection {\
  background: #BDD5FC;\
}\
\
.ace-clouds .ace_marker-layer .ace_step {\
  background: rgb(198, 219, 174);\
}\
\
.ace-clouds .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid #BFBFBF;\
}\
\
.ace-clouds .ace_marker-layer .ace_active_line {\
  background: #FFFBD1;\
}\
\
       \
.ace-clouds .ace_invisible {\
  color: #BFBFBF;\
}\
\
.ace-clouds .ace_keyword {\
  color:#AF956F;\
}\
\
.ace-clouds .ace_keyword.ace_operator {\
  color:#484848;\
}\
\
.ace-clouds .ace_constant {\
  \
}\
\
.ace-clouds .ace_constant.ace_language {\
  color:#39946A;\
}\
\
.ace-clouds .ace_constant.ace_library {\
  \
}\
\
.ace-clouds .ace_constant.ace_numeric {\
  color:#46A609;\
}\
\
.ace-clouds .ace_invalid {\
  background-color:#FF002A;\
}\
\
.ace-clouds .ace_invalid.ace_illegal {\
  \
}\
\
.ace-clouds .ace_invalid.ace_deprecated {\
  \
}\
\
.ace-clouds .ace_support {\
  \
}\
\
.ace-clouds .ace_support.ace_function {\
  color:#C52727;\
}\
\
.ace-clouds .ace_function.ace_buildin {\
  \
}\
\
.ace-clouds .ace_string {\
  color:#5D90CD;\
}\
\
.ace-clouds .ace_string.ace_regexp {\
  \
}\
\
.ace-clouds .ace_comment {\
  color:#BCC8BA;\
}\
\
.ace-clouds .ace_comment.ace_doc {\
  \
}\
\
.ace-clouds .ace_comment.ace_doc.ace_tag {\
  \
}\
\
.ace-clouds .ace_variable {\
  \
}\
\
.ace-clouds .ace_variable.ace_language {\
  \
}\
\
.ace-clouds .ace_xml_pe {\
  \
}";
    
    // import CSS once
    dom.importCssString(cssText);
    
    return {
        cssClass: "ace-clouds"
    };
})