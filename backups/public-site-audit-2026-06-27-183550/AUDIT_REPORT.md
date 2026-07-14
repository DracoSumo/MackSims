# MackSims Public-Site Repo/DNS Audit
Generated: 2026-06-27-183550
Parent path: C:\Users\draco\OneDrive\Documents\MackSims
Public site path: C:\Users\draco\OneDrive\Documents\MackSims\public-site

Backup created: C:\Users\draco\Downloads\MackSims\backups\public-site-before-audit-2026-06-27-183550.zip

## Directory inspection
```text

Mode   Length LastWriteTime        Name        
----   ------ -------------        ----        
da---l        6/24/2026 5:45:55 PM .agents     
da-h-l        6/27/2026 6:35:38 PM .git        
da---l        6/19/2026 8:39:52 PM dist        
da---l        6/27/2026 5:16:09 AM docs        
da---l        6/24/2026 4:33:05 PM Fairshare   
da---l        6/19/2026 8:34:01 PM node_modules
da---l        6/27/2026 6:35:38 PM public-site 
da---l        6/19/2026 8:37:00 PM src         



```

## Public-site inspection
```text

Mode   Length LastWriteTime        Name            
----   ------ -------------        ----            
da---l        6/27/2026 5:16:03 AM account-deletion
da---l        6/27/2026 5:16:05 AM beta            
d-----        6/27/2026 6:35:38 PM docs            
da---l        6/27/2026 5:16:08 AM fishcrew        
da---l        6/27/2026 5:15:57 AM privacy         
d-----        6/27/2026 6:35:38 PM public          
da---l        6/27/2026 5:15:53 AM scripts         
da---l        6/27/2026 5:16:06 AM shutterbid      
da---l        6/27/2026 5:16:01 AM support         
da---l        6/27/2026 5:15:59 AM terms           
-a---- 0      6/27/2026 6:35:38 PM .gitignore      
-a---l 3906   6/27/2026 5:15:55 AM index.html      
-a---l 218    6/27/2026 5:15:50 AM package.json    
-a---l 3265   6/27/2026 5:15:54 AM styles.css      



```

## Git root from public-site

```text
C:/Users/draco/OneDrive/Documents/MackSims
```

## Git status from public-site

```text
?? ../Fairshare/
?? ../dist/
?? ../docs/
?? ../node_modules/
?? ./
?? ../src/
```

## Git remotes from public-site

```text
(no output)
```

## Package/config clues

```text
 Volume in drive C is Windows
 Volume Serial Number is 1CB4-5D2D

 Directory of C:\Users\draco\OneDrive\Documents\MackSims\public-site

06/27/2026  06:35 PM    <DIR>          .
06/27/2026  05:16 AM    <DIR>          ..
06/27/2026  06:35 PM                 0 .gitignore
06/27/2026  05:16 AM    <DIR>          account-deletion
06/27/2026  05:16 AM    <DIR>          beta
06/27/2026  06:35 PM    <DIR>          docs
06/27/2026  05:16 AM    <DIR>          fishcrew
06/27/2026  05:15 AM             3,906 index.html
06/27/2026  05:15 AM               218 package.json
06/27/2026  05:15 AM    <DIR>          privacy
06/27/2026  06:35 PM    <DIR>          public
06/27/2026  05:15 AM    <DIR>          scripts
06/27/2026  05:16 AM    <DIR>          shutterbid
06/27/2026  05:15 AM             3,265 styles.css
06/27/2026  05:16 AM    <DIR>          support
06/27/2026  05:15 AM    <DIR>          terms
               4 File(s)          7,389 bytes
              12 Dir(s)  168,987,381,760 bytes free
{
  "name": "macksims-public-site",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node scripts/check-public-site.mjs",
    "lint": "node scripts/check-public-site.mjs"
  }
}
```

## DNS: nslookup -type=mx macksims.com

```text
ERROR: Non-authoritative answer:
```

## DNS: nslookup -type=txt macksims.com

```text
ERROR: Non-authoritative answer:
```

## DNS: nslookup -type=txt _dmarc.macksims.com

```text
ERROR: Non-authoritative answer:
```

## DNS: nslookup -type=cname www.macksims.com

```text
ERROR: Non-authoritative answer:
```

## DNS: nslookup -type=cname fishcrew.macksims.com

```text
ERROR: Non-authoritative answer:
```

## DNS: nslookup -type=cname shutterbid.macksims.com

```text
ERROR: Non-authoritative answer:
```

## DNS: nslookup -type=cname fairshare.macksims.com

```text
ERROR: Non-authoritative answer:
```

## DNS: nslookup -type=cname motocrew.macksims.com

```text
ERROR: *** UnKnown can't find motocrew.macksims.com: Non-existent domain
```

## HTTP: curl.exe -I https://macksims.com

```text
ERROR:   % Total    % Received % Xferd  Average Speed  Time    Time    Time   Current
```

## HTTP: curl.exe -I https://www.macksims.com

```text
ERROR:   % Total    % Received % Xferd  Average Speed  Time    Time    Time   Current
```

## HTTP: curl.exe -I https://fishcrew.macksims.com

```text
ERROR:   % Total    % Received % Xferd  Average Speed  Time    Time    Time   Current
```

## HTTP: curl.exe -I https://macksims.com/privacy

```text
ERROR:   % Total    % Received % Xferd  Average Speed  Time    Time    Time   Current
```

## HTTP: curl.exe -I https://macksims.com/terms

```text
ERROR:   % Total    % Received % Xferd  Average Speed  Time    Time    Time   Current
```

## HTTP: curl.exe -I https://macksims.com/support

```text
ERROR:   % Total    % Received % Xferd  Average Speed  Time    Time    Time   Current
```

## HTTP: curl.exe -I https://macksims.com/account-deletion

```text
ERROR:   % Total    % Received % Xferd  Average Speed  Time    Time    Time   Current
```

## HTTP: curl.exe -I https://macksims.com/beta

```text
ERROR:   % Total    % Received % Xferd  Average Speed  Time    Time    Time   Current
```

## Safety notes
- If git root is the parent MackSims folder, do not commit yet.
- Do not run git add . from the parent root.
- Do not remove old email DNS until Google Workspace send/receive is confirmed.
- DKIM cannot be invented. Generate it inside Google Admin and add the exact selector/value.
