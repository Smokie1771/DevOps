# Compte-Rendu - Lab 6 : Infrastructure as Code (IaC)

## Objectif du Lab

L'objectif de ce lab était d'apprendre l'**Infrastructure as Code (IaC)** en provisionnant des machines virtuelles en utilisant deux approches différentes :

### Part 1 : Approche Impérative - Vagrant avec Shell Provisioner
- Créer et gérer des machines virtuelles avec Vagrant
- Utiliser le Shell Provisioner pour configurer la VM de manière impérative
- Comprendre les commandes de base de Vagrant

### Part 2 : Approche Déclarative - GitLab avec Ansible Provisioner
- Installer GitLab en utilisant Vagrant et Ansible
- Utiliser des playbooks Ansible pour le provisionnement déclaratif

### Part 3 : Health Checks pour GitLab
- Configurer et exécuter des health checks pour surveiller GitLab

## Concepts Clés

### Qu'est-ce que Vagrant ?

**Vagrant** est un outil open-source pour construire et gérer des environnements de machines virtuelles. Il permet de :
- Créer des VMs de manière reproductible
- Partager des configurations d'environnement via un fichier `Vagrantfile`
- Automatiser le provisionnement des VMs

### Qu'est-ce qu'un Provider ?

Un **Provider** est le logiciel de virtualisation utilisé par Vagrant pour créer les VMs. Les providers courants sont :
- **VirtualBox** (utilisé dans ce lab) - gratuit et cross-platform
- **VMware** - solution commerciale, plus performante
- **Hyper-V** - intégré à Windows
- **Docker** - pour les conteneurs

Dans ce lab, nous avons utilisé **VirtualBox** comme provider.

### Qu'est-ce qu'une Box ?

Une **Box** Vagrant est une image de base préconfiguré d'un système d'exploitation. C'est le "template" à partir duquel Vagrant crée les VMs.

Dans ce lab, nous avons utilisé la box **`centos/7`** (CentOS 7) pour la Part 1.

### Approche Impérative vs Déclarative

| Impérative | Déclarative |
|------------|-------------|
| Définit **comment** faire | Définit **quoi** faire |
| Scripts shell étape par étape | Fichiers de configuration (YAML) |
| Ordre des commandes important | L'outil détermine l'ordre |
| Ex: Shell Provisioner | Ex: Ansible Provisioner |

## Application dans le Monde Réel

L'**Infrastructure as Code** est fondamental dans le DevOps moderne :

### Avantages de l'IaC :
- **Reproductibilité** : Les environnements sont identiques à chaque déploiement
- **Versionnement** : L'infrastructure peut être versionnée avec Git
- **Documentation automatique** : Le code EST la documentation
- **Rapidité** : Déploiement d'environnements en minutes au lieu d'heures/jours
- **Réduction des erreurs humaines** : Automatisation des tâches répétitives

### Applications réelles :
- **Environnements de développement** : Chaque développeur a la même VM
- **Tests d'intégration** : Créer des environnements de test à la demande
- **Infrastructure Cloud** : Terraform, CloudFormation pour AWS/Azure/GCP
- **CI/CD** : Pipelines qui provisionnent leurs propres environnements

## Étape dans le Cycle DevOps

L'IaC fait partie de la phase **"Build"** et **"Release"** du cycle DevOps :

```
Plan → Code → BUILD → Test → Release → DEPLOY → Operate → Monitor
              ↑                         ↑
              └── IaC (Vagrant/Ansible) ─┘
```

**Justification** :
- L'IaC automatise la création d'environnements (Build)
- Il permet le déploiement automatique d'infrastructure (Deploy)
- Il assure la cohérence entre les environnements (Dev, Test, Prod)

---

## Part 1 : Approche Impérative - Vagrant avec Shell Provisioner

### Étape 1 : Préparation de l'environnement

#### Prérequis installés :
- ✅ VirtualBox
- ✅ Vagrant
- ✅ Box `centos/7` téléchargée

#### Navigation vers le répertoire du lab :

```powershell
PS C:\Users\resho\Documents\GitHub\DevOps> cd lab6
PS C:\Users\resho\Documents\GitHub\DevOps\lab6> cd lab/part-1
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-1>
```

### Étape 2 : Analyse du Vagrantfile

Le `Vagrantfile` utilisé configure :

```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # Définition de la VM
  config.vm.define "centos_server" do |server|
    # Box utilisée : CentOS 7
    server.vm.box = "centos/7"
    
    # Configuration du provider VirtualBox
    server.vm.provider "virtualbox" do |vb|
      vb.name = "centos.server.local"
      vb.memory = 2048  # 2 GB de RAM
      vb.cpus = 1       # 1 CPU
    end
  end
  
  # Shell Provisioner (impératif)
  config.vm.provision "shell", inline: $script
end
```

#### Explication des paramètres :
| Paramètre | Valeur | Description |
|-----------|--------|-------------|
| `vm.box` | `centos/7` | Image de base CentOS 7 |
| `vb.name` | `centos.server.local` | Nom de la VM dans VirtualBox |
| `vb.memory` | `2048` | 2 GB de RAM allouée |
| `vb.cpus` | `1` | 1 CPU virtuel |

### Étape 3 : Création de la VM

```powershell
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-1> vagrant up
```

#### Résultat :

```
Bringing machine 'centos_server' up with 'virtualbox' provider...
==> centos_server: Importing base box 'centos/7'...
==> centos_server: Matching MAC address for NAT networking...
==> centos_server: Checking if box 'centos/7' version '2004.01' is up to date...
==> centos_server: Setting the name of the VM: centos.server.local
==> centos_server: Clearing any previously set network interfaces...
==> centos_server: Preparing network interfaces based on configuration...
    centos_server: Adapter 1: nat
==> centos_server: Forwarding ports...
    centos_server: 22 (guest) => 2222 (host) (adapter 1)
==> centos_server: Running 'pre-boot' VM customizations...
==> centos_server: Booting VM...
==> centos_server: Waiting for machine to boot. This may take a few minutes...
    centos_server: SSH address: 127.0.0.1:2222
    centos_server: SSH username: vagrant
    centos_server: SSH auth method: private key
    centos_server: Vagrant insecure key detected. Vagrant will automatically replace
    centos_server: this with a newly generated keypair for better security.
    centos_server: Key inserted! Disconnecting and reconnecting using new SSH key...
==> centos_server: Machine booted and ready!
==> centos_server: Rsyncing folder: /cygdrive/c/Users/resho/Documents/GitHub/DevOps/lab6/lab/part-1/ => /vagrant
==> centos_server: Running provisioner: shell...
    centos_server: Running: inline script
    centos_server: Hello, World
```

✅ La VM a été créée et démarrée avec succès !

### Étape 4 : Vérification du statut de la VM

```powershell
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-1> vagrant status
```

#### Résultat :

```
Current machine states:

centos_server             running (virtualbox)

The VM is running. To stop this VM, you can run `vagrant halt` to
shut it down forcefully, or you can run `vagrant suspend` to simply
suspend the virtual machine. In either case, to restart it again,
simply run `vagrant up`.
```

### Étape 5 : Connexion SSH à la VM

```powershell
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-1> vagrant ssh
```

Une fois connecté, nous sommes dans la VM CentOS :

```bash
[vagrant@localhost ~]$
```

### Étape 6 : Test du Shell Provisioner - Configuration de /etc/hosts

Modification du Vagrantfile pour ajouter une entrée dans `/etc/hosts` :

```ruby
# Start provisioning
config.vm.provision "shell",
  inline: "echo '127.0.0.1  mydomain-1.local' >> /etc/hosts"
```

Exécution du provisionnement :

```powershell
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-1> vagrant provision
```

#### Vérification dans la VM :

```bash
[vagrant@localhost ~]$ cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
127.0.0.1  mydomain-1.local
```

✅ L'entrée `mydomain-1.local` a bien été ajoutée !

### Étape 7 : Test du Shell Provisioner - Script multi-lignes

Modification du Vagrantfile avec un script plus complexe :

```ruby
# Start provisioning
$script = <<-SCRIPT
echo I am provisioning...
date > /etc/vagrant_provisioned_at
SCRIPT

config.vm.provision "shell", inline: $script
```

Exécution du provisionnement :

```powershell
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-1> vagrant provision
==> centos_server: Running provisioner: shell...
    centos_server: Running: inline script
    centos_server: I am provisioning...
```

#### Vérification dans la VM :

```bash
[vagrant@localhost ~]$ cat /etc/vagrant_provisioned_at
Thu Feb 12 08:41:21 UTC 2026
```

✅ Le script a bien créé le fichier avec la date de provisionnement !

### Commandes Vagrant Utilisées

| Commande | Description |
|----------|-------------|
| `vagrant up` | Créer et démarrer la VM |
| `vagrant status` | Vérifier l'état de la VM |
| `vagrant ssh` | Se connecter à la VM en SSH |
| `vagrant provision` | Exécuter/ré-exécuter le provisionnement |
| `vagrant halt` | Arrêter la VM |
| `vagrant destroy` | Supprimer complètement la VM |

---

## Part 2 : Approche Déclarative - GitLab avec Ansible Provisioner

### Concepts : Ansible et l'approche déclarative

**Ansible** est un outil d'automatisation qui utilise une approche **déclarative** :
- On décrit l'**état final souhaité** (ex: "GitLab doit être installé")
- Ansible détermine automatiquement les étapes nécessaires
- Configuration via des fichiers YAML (playbooks)
- Idempotent : peut être exécuté plusieurs fois avec le même résultat

**Différence avec Shell (Impératif)** :
- **Shell** : "Exécute ces commandes dans cet ordre"
- **Ansible** : "Assure-toi que le système soit dans cet état"

### Étape 1 : Préparation - Nouvelle Box Rocky Linux 8

Pour cette partie, nous utilisons une box différente :

| Paramètre | Part 1 | Part 2 |
|-----------|--------|--------|
| **Box** | `centos/7` | `generic/rocky8` |
| **OS** | CentOS 7 | Rocky Linux 8 |
| **RAM** | 2 GB | 4 GB |
| **Provisioner** | Shell (impératif) | Ansible (déclaratif) |
| **Application** | Simple tests | GitLab complet |

**Pourquoi Rocky Linux 8 ?**
- CentOS 7 est obsolète (EOL en 2024)
- Rocky Linux est le successeur communautaire de CentOS
- Plus moderne et mieux supporté par GitLab

### Étape 2 : Navigation et lancement

```powershell
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-1> cd..
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab> cd part-2
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-2> vagrant up
```

### Étape 3 : Téléchargement de la Box

```
==> gitlab_server: Box 'generic/rocky8' could not be found. Attempting to find and install...
    gitlab_server: Box Provider: virtualbox
    gitlab_server: Box Version: >= 0
==> gitlab_server: Loading metadata for box 'generic/rocky8'
    gitlab_server: URL: https://vagrantcloud.com/api/v2/vagrant/generic/rocky8
==> gitlab_server: Adding box 'generic/rocky8' (v4.3.12) for provider: virtualbox (amd64)
    gitlab_server: Downloading: https://vagrantcloud.com/generic/boxes/rocky8/versions/4.3.12/providers/virtualbox/amd64/vagrant.box
    gitlab_server: Calculating and comparing box checksum...
==> gitlab_server: Successfully added box 'generic/rocky8' (v4.3.12) for 'virtualbox (amd64)'!
```

✅ La box `generic/rocky8` version 4.3.12 a été téléchargée et ajoutée.

### Étape 4 : Création de la VM

```
==> gitlab_server: Importing base box 'generic/rocky8'...
==> gitlab_server: Setting the name of the VM: gitlab.server.local
==> gitlab_server: Fixed port collision for 22 => 2222. Now on port 2200.
==> gitlab_server: Preparing network interfaces based on configuration...
    gitlab_server: Adapter 1: nat
    gitlab_server: Adapter 2: hostonly
==> gitlab_server: Forwarding ports...
    gitlab_server: 80 (guest) => 8080 (host) (adapter 1)
    gitlab_server: 22 (guest) => 2200 (host) (adapter 1)
==> gitlab_server: Machine booted and ready!
```

**Configuration réseau** :
- **Port 80 (VM)** → **8080 (Host)** : Accès GitLab via http://localhost:8080
- **Port 22 (VM)** → **2200 (Host)** : SSH (collision évitée avec Part 1)
- **2 adaptateurs réseau** : NAT + Host-Only (plus complexe que Part 1)

### Étape 5 : Installation d'Ansible

```
==> gitlab_server: Running provisioner: ansible_local...
    gitlab_server: Installing Ansible...
```

Vagrant installe automatiquement Ansible **dans la VM** (pas besoin de l'avoir sur Windows !). C'est l'avantage du provisioner `ansible_local`.

### Étape 6 : Exécution des Playbooks Ansible

Le playbook Ansible exécute automatiquement toutes les tâches :

```
PLAY [gitlab_server] ***********************************************************

TASK [Gathering Facts] *********************************************************
ok: [gitlab_server]

TASK [gitlab/install : Install required packages] ******************************
changed: [gitlab_server]

TASK [gitlab/install : Enable and start sshd] **********************************
ok: [gitlab_server]

TASK [gitlab/install : Enable HTTP+HTTPS access] *******************************
changed: [gitlab_server] => (item=http)
changed: [gitlab_server] => (item=https)

TASK [gitlab/install : Reload firewalld] ***************************************
changed: [gitlab_server]

TASK [gitlab/install : Install postfix] ****************************************
changed: [gitlab_server]

TASK [gitlab/install : Listen only ipv4 with postfix] **************************
changed: [gitlab_server]

TASK [gitlab/install : Enable and start postfix] *******************************
changed: [gitlab_server]

TASK [gitlab/install : Download GitLab install script] *************************
changed: [gitlab_server]

TASK [gitlab/install : Execute GitLab install script] **************************
changed: [gitlab_server]

TASK [gitlab/install : Install GitLab] *****************************************
changed: [gitlab_server]

PLAY RECAP *********************************************************************
gitlab_server              : ok=11   changed=9    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

#### Explication des tâches Ansible :

| Tâche | Description | Résultat |
|-------|-------------|----------|
| **Gathering Facts** | Collecte d'informations sur le système | ok |
| **Install required packages** | Installation de curl, policycoreutils, openssh-server, etc. | changed |
| **Enable and start sshd** | Démarrage du service SSH | ok |
| **Enable HTTP+HTTPS access** | Ouverture des ports 80/443 dans le firewall | changed |
| **Reload firewalld** | Rechargement du firewall | changed |
| **Install postfix** | Installation du serveur mail (notifications GitLab) | changed |
| **Listen only ipv4 with postfix** | Configuration Postfix | changed |
| **Enable and start postfix** | Démarrage de Postfix | changed |
| **Download GitLab install script** | Téléchargement du script officiel GitLab | changed |
| **Execute GitLab install script** | Ajout du dépôt GitLab | changed |
| **Install GitLab** | Installation complète de GitLab CE | changed |

**Statut : ok=11 changed=9 failed=0** ✅

⏱️ **Durée totale** : ~35-40 minutes (dont 30 minutes pour l'installation de GitLab)

### Étape 7 : Mise à jour des Playbooks (optionnel)

```powershell
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-2> vagrant upload playbooks /vagrant/playbooks gitlab_server

Uploading playbooks to /vagrant/playbooks
Upload has completed successfully!
```

Cette commande permet de mettre à jour les playbooks dans la VM sans la détruire.

### Étape 8 : Re-provisionnement

```powershell
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-2> vagrant provision
```

**Résultat** :
```
PLAY RECAP *********************************************************************
gitlab_server              : ok=11   changed=2    unreachable=0    failed=0
```

Cette fois, seulement **2 tâches ont changé** (au lieu de 9). C'est la **propriété d'idempotence** d'Ansible : il ne refait que ce qui est nécessaire.

### Étape 9 : Connexion SSH et vérification

```bash
vagrant ssh

[vagrant@rocky8 ~]$ sudo gitlab-ctl status
```

**Services GitLab actifs** :
```
run: alertmanager: (pid 15932) 290s
run: gitaly: (pid 15060) 953s
run: gitlab-exporter: (pid 15815) 341s
run: gitlab-kas: (pid 15399) 905s
run: gitlab-workhorse: (pid 15663) 404s
run: logrotate: (pid 14960) 981s
run: nginx: (pid 15700) 392s
run: node-exporter: (pid 15771) 359s
run: postgres-exporter: (pid 15980) 273s
run: postgresql: (pid 15149) 926s
run: prometheus: (pid 15889) 307s
run: puma: (pid 15565) 434s
run: redis: (pid 15012) 965s
run: redis-exporter: (pid 15851) 325s
run: sidekiq: (pid 16082) 112s
```

✅ **15 services GitLab** sont actifs et fonctionnels !

### Étape 10 : Récupération du mot de passe root

```bash
[vagrant@rocky8 ~]$ sudo cat /etc/gitlab/initial_root_password
```

Le fichier contient le mot de passe initial généré aléatoirement pour l'utilisateur **`root`**.

### Étape 11 : Test de l'installation

**Accès à GitLab** :
1. Ouvrir le navigateur sur Windows
2. Aller à **http://localhost:8080**
3. Page de connexion GitLab s'affiche ✅

**Connexion** :
- **Username** : `root`
- **Password** : [contenu de `/etc/gitlab/initial_root_password`]

✅ **GitLab est opérationnel !**

### Architecture déployée par Ansible

```
┌─────────────────────────────────────────────────────────┐
│              gitlab.server.local (VM)                   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  NGINX (port 80) ───────────────┐                │  │
│  └──────────────────────────────────│────────────────┘  │
│                                     ↓                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  PUMA (GitLab App Server)                        │  │
│  └──────────────────────────────────────────────────┘  │
│          │                      │                       │
│          ↓                      ↓                       │
│  ┌──────────────┐      ┌──────────────┐                │
│  │ PostgreSQL   │      │    Redis     │                │
│  │  (Database)  │      │   (Cache)    │                │
│  └──────────────┘      └──────────────┘                │
│          ↓                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Gitaly (Git Storage)                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Services de monitoring :                              │
│  - Prometheus, Alertmanager                            │
│  - Node Exporter, Redis Exporter, Postgres Exporter   │
│  - Sidekiq (Background Jobs)                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
                        ↑
                  Port Forwarding
                  80 → 8080
                        ↓
              http://localhost:8080
```

### Comparaison Part 1 vs Part 2

| Aspect | Part 1 (Shell) | Part 2 (Ansible) |
|--------|---------------|------------------|
| **Approche** | Impérative | Déclarative |
| **Complexité** | Simple (echo, date) | Avancée (GitLab complet) |
| **Durée** | ~2 minutes | ~35-40 minutes |
| **Services** | Aucun | 15 services |
| **Idempotence** | Non | Oui |
| **Reproductibilité** | Moyenne | Excellente |
| **Maintenabilité** | Difficile (scripts) | Facile (YAML) |

## Part 3 : Health Checks pour GitLab

### Concept : Health Checks

Les **Health Checks** sont des endpoints HTTP qui permettent de surveiller l'état d'une application. GitLab expose 3 types de checks :

| Endpoint | Description | Usage |
|----------|-------------|-------|
| **`/-/health`** | Vérification basique | Est-ce que GitLab répond ? |
| **`/-/readiness`** | État des services | Tous les services sont-ils prêts ? |
| **`/-/liveness`** | État de l'application | L'application est-elle vivante ? |

**Utilisation en production** :
- **Load Balancers** : Routent le trafic seulement vers les instances "ready"
- **Kubernetes** : Redémarre les pods qui échouent au liveness check
- **Monitoring** : Alertes si les checks échouent (Prometheus, Nagios, etc.)

### Étape 1 : Modification du Playbook

Ajout des 2 autres health checks au fichier `playbooks/roles/gitlab/healthchecks/tasks/main.yml` :

```yaml
- name: Check GitLab readiness
  uri:
    url: http://127.0.0.1:8080/-/readiness
    return_content: yes
  register: gitlab_readiness

- name: Print GitLab readiness
  debug:
    msg: "{{ gitlab_readiness.json }}"

- name: Check GitLab liveness
  uri:
    url: http://127.0.0.1:8080/-/liveness
    return_content: yes
  register: gitlab_liveness

- name: Print GitLab liveness
  debug:
    msg: "{{ gitlab_liveness.content }}"
```

### Étape 2 : Upload du Playbook mis à jour

```powershell
PS C:\Users\resho\Documents\GitHub\DevOps\lab6\lab\part-2> vagrant upload playbooks /vagrant/playbooks gitlab_server

Uploading playbooks to /vagrant/playbooks
Upload has completed successfully!

  Source: playbooks
  Destination: /vagrant/playbooks
```

✅ Les playbooks modifiés sont maintenant dans la VM.

### Étape 3 : Tests manuels avec curl

Connexion à la VM et test des 3 endpoints :

```bash
[vagrant@rocky8 ~]$ curl http://127.0.0.1:8080/-/health
GitLab OK

[vagrant@rocky8 ~]$ curl http://127.0.0.1:8080/-/readiness
{"status":"ok","master_check":[{"status":"ok"}]}

[vagrant@rocky8 ~]$ curl http://127.0.0.1:8080/-/liveness
{"status":"ok"}
```

#### Analyse des résultats :

**1. Health Check** : 
- Réponse : `GitLab OK`
- Signification : GitLab répond, l'application web est active

**2. Readiness Check** :
- Réponse : `{"status":"ok","master_check":[{"status":"ok"}]}`
- Signification : 
  - Tous les services sont prêts
  - Le master (serveur principal) est OK
  - À utiliser avec load balancers

**3. Liveness Check** :
- Réponse : `{"status":"ok"}`
- Signification :
  - L'application est vivante
  - Pas besoin de redémarrage
  - À utiliser avec Kubernetes pour auto-healing

✅ **Tous les health checks sont au vert !**

### Étape 4 : Exécution du Playbook Ansible

Maintenant, exécutons le playbook avec le tag `check` pour automatiser ces vérifications :

```bash
[vagrant@rocky8 ~]$ ansible-playbook /vagrant/playbooks/run.yml --tags check -i /tmp/vagrant-ansible/inventory/vagrant_ansible_local_inventory
```

#### Résultat :

```
PLAY [gitlab_server] ***********************************************************

TASK [Gathering Facts] *********************************************************
ok: [gitlab_server]

TASK [gitlab/healthchecks : Check GitLab health] *******************************
ok: [gitlab_server]

TASK [gitlab/healthchecks : Print GitLab health] *******************************
ok: [gitlab_server] => {
    "msg": "GitLab OK"
}

TASK [gitlab/healthchecks : Check GitLab readiness] ****************************
ok: [gitlab_server]

TASK [gitlab/healthchecks : Print GitLab readiness] ****************************
ok: [gitlab_server] => {
    "msg": {
        "master_check": [
            {
                "status": "ok"
            }
        ],
        "status": "ok"
    }
}

TASK [gitlab/healthchecks : Check GitLab liveness] *****************************
ok: [gitlab_server]

TASK [gitlab/healthchecks : Print GitLab liveness] *****************************
ok: [gitlab_server] => {
    "msg": {
        "status": "ok"
    }
}

PLAY RECAP *********************************************************************
gitlab_server              : ok=7    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

### Analyse du Playbook Ansible

**Résumé** : `ok=7 changed=0 failed=0` ✅

Les 7 tâches exécutées :
1. ✅ Gathering Facts - Collecte des informations système
2. ✅ Check GitLab health - Requête HTTP vers `/-/health`
3. ✅ Print GitLab health - Affiche "GitLab OK"
4. ✅ Check GitLab readiness - Requête vers `/-/readiness`
5. ✅ Print GitLab readiness - Affiche le JSON avec master_check
6. ✅ Check GitLab liveness - Requête vers `/-/liveness`
7. ✅ Print GitLab liveness - Affiche {"status":"ok"}

**Avantages de l'automatisation avec Ansible** :
- Tests reproductibles dans le temps
- Integration possible dans un pipeline CI/CD
- Notifications automatiques en cas d'échec
- Documentation via code (Infrastructure as Code)

### Module Ansible utilisé : `uri`

Le module **`uri`** d'Ansible permet de faire des requêtes HTTP :

```yaml
- name: Check GitLab readiness
  uri:
    url: http://127.0.0.1:8080/-/readiness
    return_content: yes  # Retourne le contenu de la réponse
  register: gitlab_readiness  # Stocke la réponse dans une variable
```

Paramètres utilisés :
- `url` : L'endpoint à tester
- `return_content: yes` : Récupère le body de la réponse
- `register` : Stocke le résultat dans une variable Ansible

## Finalité Globale du Lab

### ✅ L'objectif COMPLET du lab est REMPLI

**Résultats obtenus** :

### Part 1 : Approche Impérative ✅

1. ✅ **VM CentOS 7 créée** avec VirtualBox comme provider
2. ✅ **Connexion SSH** à la VM fonctionnelle
3. ✅ **Shell Provisioner** testé avec :
   - Configuration de `/etc/hosts` avec nouvelle entrée
   - Création de fichier avec timestamp de provisionnement
4. ✅ **Commandes Vagrant maîtrisées** : `up`, `status`, `ssh`, `provision`

### Part 2 : Approche Déclarative ✅

1. ✅ **VM Rocky Linux 8 créée** avec 4 GB RAM
2. ✅ **Ansible installé automatiquement** dans la VM via `ansible_local`
3. ✅ **GitLab installé complètement** avec 15 services
4. ✅ **Playbook Ansible exécuté** : 11 tâches, 9 changed, 0 failed
5. ✅ **GitLab accessible** à http://localhost:8080
6. ✅ **Connexion réussie** avec user `root` et mot de passe initial
7. ✅ **Propriété d'idempotence** testée

### Part 3 : Health Checks ✅

1. ✅ **Playbook modifié** avec 2 nouveaux health checks (readiness, liveness)
2. ✅ **3 endpoints testés manuellement** avec curl :
   - `/-/health` → "GitLab OK"
   - `/-/readiness` → {"status":"ok","master_check":[{"status":"ok"}]}
   - `/-/liveness` → {"status":"ok"}
3. ✅ **Playbook Ansible exécuté** avec tag `check` : 7 tâches, 0 failed
4. ✅ **Module `uri`** utilisé pour automatiser les requêtes HTTP
5. ✅ **Résultats affichés** avec le module `debug`

### Impact DevOps

Ce lab couvre des pratiques essentielles du cycle DevOps :

```
┌──────────────────────────────────────────────────────────┐
│                    Cycle DevOps                          │
│                                                          │
│  Plan → Code → BUILD → Test → RELEASE → Deploy          │
│                  ↑              ↑         ↑              │
│                  └──── IaC (Vagrant + Ansible) ──────┘   │
│                                                          │
│  Deploy → OPERATE → Monitor                              │
│            ↑         ↑                                   │
│            └─ Health Checks ─┘                          │
└──────────────────────────────────────────────────────────┘
```

**Conclusion** : Ce lab démontre comment l'Infrastructure as Code permet de créer des environnements reproductibles et automatisés, piliers du DevOps moderne.
