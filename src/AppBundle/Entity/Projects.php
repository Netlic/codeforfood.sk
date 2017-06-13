<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Projects
 *
 * @ORM\Table(name="projects")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProjectsRepository")
 */
class Projects {

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $start;

    /**
     * @ORM\Column(type="datetime")
     */
    private $end;

    /**
     * @ORM\Column(type="string", length=50, name="project_name")
     */
    private $projectName;

    /**
     * @ORM\Column(type="text", name="project_desc")
     */
    private $projectDesc;

    /**
     * @ORM\ManyToMany(targetEntity="Technologies")
     * @ORM\JoinTable(name="projects_technologies",
     *      joinColumns={@ORM\JoinColumn(name="project", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="technology", referencedColumnName="id")}
     *      )
     */
    private $tech;

    /**
     * @ORM\ManyToMany(targetEntity="Roles")
     * @ORM\JoinTable(name="projects_roles",
     *      joinColumns={@ORM\JoinColumn(name="project", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="roles", referencedColumnName="id")}
     *      )
     */
    private $roles;
    
    /**
     * @ORM\ManyToOne(targetEntity="Directories", inversedBy="projects")
     * @ORM\JoinColumn(name="directory", referencedColumnName="id")
     */
    private $directory;

    public function __construct() {
        $this->tech = new \Doctrine\Common\Collections\ArrayCollection();
        $this->roles = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Set start
     *
     * @param \DateTime $start
     *
     * @return Projects
     */
    public function setStart($start) {
        $this->start = $start;

        return $this;
    }

    /**
     * Get start
     *
     * @return \DateTime
     */
    public function getStart() {
        return $this->start;
    }

    /**
     * Set end
     *
     * @param \DateTime $end
     *
     * @return Projects
     */
    public function setEnd($end) {
        $this->end = $end;

        return $this;
    }

    /**
     * Get end
     *
     * @return \DateTime
     */
    public function getEnd() {
        return $this->end;
    }

    /**
     * Set projectName
     *
     * @param string $projectName
     *
     * @return Projects
     */
    public function setProjectName($projectName) {
        $this->projectName = $projectName;

        return $this;
    }

    /**
     * Get projectName
     *
     * @return string
     */
    public function getProjectName() {
        return $this->projectName;
    }

    /**
     * Set projectDesc
     *
     * @param string $projectDesc
     *
     * @return Projects
     */
    public function setProjectDesc($projectDesc) {
        $this->projectDesc = $projectDesc;

        return $this;
    }

    /**
     * Get projectDesc
     *
     * @return string
     */
    public function getProjectDesc() {
        return $this->projectDesc;
    }

    /**
     * Get technologies associated to project
     * 
     * @return \Doctrine\Common\Collections\ArrayCollection
     */
    public function getTech() {
        return $this->tech;
    }

    /**
     * Get roles associated with project
     * 
     * @return \Doctrine\Common\Collections\ArrayCollection
     */
    public function getRoles() {
        return $this->roles;
    }
    
    /**
     * Get associated directory with project
     * 
     * @return \Doctrine\Common\Collections\ArrayCollection
     */
    public function getDirectory() {
        return $this->directory;
    }
}
