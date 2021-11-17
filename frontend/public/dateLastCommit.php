<?php
    header("Content-Type: text/plain");
    echo substr(shell_exec("git show HEAD --pretty=format:'%ci'"),0,10);