<?php

namespace AppBundle\Repository;

use Doctrine\ORM\Query\Expr\Join;

class ProjectsRepository extends \Doctrine\ORM\EntityRepository {

    /**
     * Finds technology info about given project
     * @param int $project id of project
     * @return array
     */
    public function findTechInfoByProject($project) {
        $qb = $this->getEntityManager()->createQueryBuilder();
        $qb->select('t.name')
                ->from('AppBundle:Projects', 'p')->innerJoin('AppBundle:ProjectsTechnologies', 'pt', Join::WITH, 'p.id = pt.project')
                ->innerJoin('AppBundle:Technologies', 't', Join::WITH, 'pt.technology = t.id')->where('p.id = ?1')->setParameter("1", $project);
        return $qb->getQuery()->getArrayResult();
    }

}
