<?php
header("Access-Control-Allow-Origin: *");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit;
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
http_response_code(200);

require_once "./modules/get.php";
require_once "./modules/post.php";
require_once "./modules/delete.php";
require_once "./config/database.php";

$con = new Connection();
$pdo = $con->connect();

$get = new Get($pdo);
$post = new Post($pdo);
$delete = new Delete($pdo);

if (isset($_REQUEST['request'])) {
    // Split the request into an array based on '/'
    $request = explode('/', $_REQUEST['request']);
} else {
    // If 'request' parameter is not set, return a 404 response
    echo "Not Found";
    http_response_code(404);
}

// Handle requests based on HTTP method
switch ($_SERVER['REQUEST_METHOD']) {
        // Handle GET requests
    case 'GET':
        switch ($request[0]) {
            case 'get-data':
                echo json_encode($get->view_user_images($_GET));
                break;
            case 'get-gallery':
                echo json_encode($get->view_user_images($_GET));
                break;
            case 'get-galleries':
                echo json_encode($get->get_all_images($_GET));
                break;
            case 'get-comments':
                echo json_encode($get->get_comments_by_image_id($_GET));
                break;

            default:
                // Return a 403 response for unsupported requests
                echo "This is forbidden";
                http_response_code(403);
                break;
        }
        break;
        // Handle POST requests    
    case 'POST':
        // Retrieves JSON-decoded data from php://input using file_get_contents
        $data = json_decode(file_get_contents("php://input"));
        switch ($request[0]) {
            case 'add-user':
                // Return JSON-encoded data for adding employees
                echo json_encode($post->add_user($data));
                break;
          
            case 'add-image':
                echo json_encode($post->add_image($_POST));
                break;
            case 'add-comment':
                echo json_encode($post->add_comment($_POST));
                break;
            case 'edit-image':
                echo json_encode($post->edit_image($_POST));
                break;
     
            case 'login':
                // Return JSON-encoded data for adding employees
                echo json_encode($post->login($data));
                break;
            case 'update-filter':
                echo json_encode($post->update_filter($data));
                    break;

            default:
                // Return a 403 response for unsupported requests
                echo "This is forbidden";
                http_response_code(403);
                break;
        }
        break;
        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"));
            switch ($request[0]) {
                case 'delete-image':
                    echo json_encode(isset($request[1]) ? $post->delete_image($request[1]) : $post->sendPayload(null, "error", "Image ID not provided.", null));
                    break;
                case 'delete-comment':
                    echo json_encode(isset($request[1]) ? $post->delete_comment($request[1]) : $post->sendPayload(null, "error", "Comment ID not provided.", null));
                    break;
                default:
                    echo "This is forbidden";
                    http_response_code(403);
                    break;
            }
            break;
        default:
            echo "Method not available";
            http_response_code(404);
            break;

  
}
