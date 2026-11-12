/*
 * Lemme — configuration du service de comptes et de synchronisation.
 *
 * Laisser les deux valeurs vides désactive les comptes : la progression reste
 * alors sur l'appareil, et rien n'est envoyé nulle part.
 *
 * Pour activer la synchronisation (voir README, « Activer la synchronisation ») :
 *   supabaseUrl : adresse du projet, de la forme https://xxxxxxxx.supabase.co
 *   supabaseKey : clé publique du projet (« anon » ou « publishable »).
 *
 * Cette clé est faite pour être publiée : elle ne donne accès à rien sans les
 * règles de la base (supabase/schema.sql), qui limitent chaque personne à ses
 * propres données. Ne JAMAIS mettre ici la clé « service_role » ou « secret ».
 */
window.LEMME_CONFIG = {
  supabaseUrl: '',
  supabaseKey: ''
};
