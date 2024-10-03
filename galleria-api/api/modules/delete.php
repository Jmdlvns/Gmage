<?php

require_once 'global.php';


class Delete extends GlobalMethods
{
    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }


}
