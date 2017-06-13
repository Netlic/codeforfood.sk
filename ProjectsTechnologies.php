<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ProjectsTechnologies
 *
 * @ORM\Table(name="projects_technologies")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProjectsTechnologiesRepository")
 */
class ProjectsTechnologies
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="project", type="integer")
     * 
     */
    private $project;

    /**
     * @var int
     *
     * @ORM\Column(name="technology", type="integer")
     */
    private $technology;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set project
     *
     * @param integer $project
     *
     * @return ProjectsTechnologies
     */
    public function setProject($project)
    {
        $this->project = $project;

        return $this;
    }

    /**
     * Get project
     *
     * @return int
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * Set technology
     *
     * @param integer $technology
     *
     * @return ProjectsTechnologies
     */
    public function setTechnology($technology)
    {
        $this->technology = $technology;

        return $this;
    }

    /**
     * Get technology
     *
     * @return int
     */
    public function getTechnology()
    {
        return $this->technology;
    }
}

