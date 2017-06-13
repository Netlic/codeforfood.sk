<?php

namespace AppBundle\Services;

class LangService {

    public function getShowedLangs(array $langs, $count = 2) {
        return array_slice($langs, 0, $count);
    }
}
