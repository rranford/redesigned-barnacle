<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="/src/css/custom.css">
    </head>
    <body>
        <select id="interpolate">
            <option>basis-closed</option>
            <option>linear</option>
            <option selected="selected">basis</option>
            <option>cardinal-closed</option>
            <option>cardinal</option>
            <option>monotone</option>
            <option>step</option>
            <option>step-before</option>
            <option>step-after</option>
        </select>
        <script type="text/javascript" src="/src/d3/d3.v3.js"></script>
        <script type="text/javascript" src="/src/js/depth_mag.js"></script>
        <script>
            render();
        </script>
    </body>