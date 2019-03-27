
# Comment déployer cette application?

C'est un peu compliqué, mais on est là pour vous guider étape par étape! :)

## Se connecter sur le serveur OVH1

### Prérequis

 - Il faut d'abord avoir une clé ssh publique et l'ajouter sur le
   serveur. Pas de panique, c'est très simple et Monsieur Brucker saura
   vous aider!
 - Il faut également avoir accès à un terminal de commande de type bash
   (Terminal natif sur Mac et Linux, Powershell pour Windows).
 - Il faut impérativement avoir installé git sur sa machine ([tout est expliqué ici](https://git-scm.com/book/fr/v1/D%C3%A9marrage-rapide-Installation-de-Git))


### Connexion

Pour se connecter sur le serveur, il suffit de rentrer la commande suivante:

```
ssh -A oignon@ovh1.ec-m.fr
```
Si vous avez rempli tous les prérequis, ça devrait fonctionner! 


## Déploiement

A cette étape, on devrait être connecté sur le serveur OVH1.
Regardons rapidement ce qu'on peut y trouver:
```
ls
```
```
database_readme.txt django.sh* flask.sh* node/  package-lock.json  readme.txt tomcat7/

django/ flask/ java/ node.bak/ php.sh* tomcat.sh* www/
```

Les deux dossier importants ici sont `node/` et `node.bak/`
C'est en effet dans `node/` qu'on mettra notre projet.
`node.bak/` est un dossier de back-up. Typiquement, si on veut déployer la version N de l'application, on y mettra la version N-1.

### Déplacer la version N-1 dans le dossier de back-up
Tout d'abord, il faut supprimer le dossier de back-up:
```
rm -rf node.bak
```
Puis on déplace la version N-1 dans un nouveau dossier back-up:
```
mv node node.bak
```
### Cloner le repo Github

A cette étape, on a bien pris soin de déplacer la version N-1 dans le dossier `node.bak/`, il ne nous reste plus qu'à déployer la version N. Pour ceci on va tout simplement "cloner" ce repository Github dans un nouveau dossier `node/`. 
```
git clone https://github.com/campusfire/campusfire_server.git node
```
Ca y est, la version N est sur le serveur, il ne reste plus qu'à la lancer!

### Lancer le serveur
#### Généralités

Pour lancer notre application, on va utiliser un outil qui s'appelle tmux. Dans le jargon technique, c'est un multiplexer de terminal, mais on peut voir ça plus simplement comme une grosse machine qui fait tourner notre application.
C'est pas ce qu'il y a de plus instinctif à prendre en main, mais en cas de doute, il y a quelques documentations sur le net qui listent les commandes fondamentales ([ici par exemple](https://gist.github.com/MohamedAlaa/2961058))
#### Supprimer les anciennes sessions
Avant de faire quoi que ce soit, il faut s'assurer qu'il n'y a pas d'autres sessions tmux qui tournent sur notre serveur. La commande `tmux ls` permet de lister toutes les sessions tmux actives du serveur. Si il y en a, vous devriez voir quelque chose qui ressemble à ceci:
```
0: 1 windows (created Tue Mar 26 15:04:45 2019) [80x23]
```
Si vous avez déplacé l'ancienne version de l'application dans `node.bak/`, cette session ne sert à rien, il faut donc l'arrêter avec la commande suivante:
```
tmux kill-session -t [n° de la session]
```
Par exemple, sur l'exemple ci-dessus, le numero de la session qu'on veut arrêter est 0, il faut donc écrire :
```
tmux kill-session -t 0
```
Désormais, si on tape `tmux ls`, on ne devrait rien voir!
#### Lancer une nouvelle session
Pour lancer une nouvelle session tmux, il faut au préalable se rendre dans le dossier node...
```
cd node
```
...puis rentrer la commande suivante:
```
tmux
```
A cette étape vous devriez avoir un affichage un peu special et différent, avec une barre en dessous de votre terminal qui indique que vous êtes bien dans le tmux.

On va tout d'abord installer toutes les dépendances dont notre application a besoin. Pour cela on utilise le gestionnaires de packets **npm**, en rentrant tout simplement la ligne suivante:
```
npm install
```
Il suffit ensuite de lancer l'application avec la commande suivante:
```
node server.js
```
Et voilà, normalement ton application est désormais disponible sur http://node.oignon.ovh1.ec-m.fr/display

Enjoy!