// ---- Define your dialogs  and panels here ----

$('.permbutton').append('Permissions')
$('#perm_').attr('filepath', '/C')
$('#perm_').attr('username', 'administrator')


let permissionPrintOut = define_new_effective_permissions('perm_', true)
let newUserField = define_new_user_select_field('user_', 'Select User', on_user_change = function (selected_user) {
    $('#perm_').attr('username', selected_user)
    $('#perm_').attr('filepath', '/C/presentation_documents/important_file.txt_permicon')
})
$('#sidepanel').append(permissionPrintOut)
$('#sidepanel').append(newUserField)


// let blankDia = define_new_dialog(id_prefix='blank', title = 'blank')

// $('.perm_info').click(function () {
//     console.log('clicked!');
//     // $( "#dialog" ).dialog();
//     blankDia.dialog('open');
//     let myPath = $('#perm_').attr('filepath')
//     console.log(myPath)
//     let myUsername = $('#perm_').attr('username')
//     console.log(myUsername)
//     let myPermName = $(this).attr('permission_name')
//     console.log(myPermName)
//     let my_file_obj_var = path_to_file[myPath];
//     let myIsAllowed = allow_user_action();
//     let myExplanation = null
// })



$('.perm_info').click(function () {
    console.log('clicked!');
    let blankDia = define_new_dialog(id_prefix = 'blank', title = 'blank')
    blankDia.dialog('open');
    
    let myPath = $('#perm_').attr('filepath')
    console.log(myPath)
    let myUsername = $('#perm_').attr('username')
    console.log(myUsername)
    let myUserObject = all_users[myUsername]
    let myPermName = $(this).attr('permission_name')
    console.log(myPermName)
    let my_file_obj_var = path_to_file[myPath];
    let myIsAllowed, myExplanation = allow_user_action(my_file_obj_var, myUserObject, myPermName, explain_why=true);
    let readableExplanation = get_explanation_text(myExplanation)
    blankDia.append(readableExplanation)
})

// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if (file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if (file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for (child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for (let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $("#filestructure").append(file_elem);
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click(function (e) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id, new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId()





