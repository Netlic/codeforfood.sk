<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller {

    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request) {
        $projects = $this->getDoctrine()->getRepository('AppBundle:Projects')->findBy([], ["start" => "DESC"]);
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir') . '/..') . DIRECTORY_SEPARATOR,
            'projects' => $projects
        ]);
    }

    /**
     * @Route("/test", name="test")
     */
    public function testAction() {
        return $this->render('default/test.html.twig');
    }

    /**
     * @Route("/langs", name="langs")
     */
    public function langsAction(Request $request) {
        $allLangs = $this->getDoctrine()->getRepository('AppBundle:Langs')->findBy([], ["short" => "ASC"]);
        $langs = $this->get('app.lang')->getShowedLangs($allLangs);
        return $this->render('fragments/langs.html.twig', [
            'langs' => $allLangs,
            'dLangs' => $langs
        ]);
    }

    /**
     * @Route("/projects-details/{project}", name="projects-details", requirements={"project": "\d+"})
     */
    public function projectsDetailsAction($project = 1) {
        $projects = $this->getDoctrine()->getRepository('AppBundle:Directories')->findBy([], ["id" => "ASC"]);
        return $this->render('default/projects.html.twig', [
            'projects' => $projects,
            'scrollToId' => $project
        ]);
    }

    /**
     * @Route("/info-details", name="info-details")
     */
    public function infoDetailsAction() {
        return $this->render('default/info.html.twig');
    }

}
