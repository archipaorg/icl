/**StatusDetails is a set of additional properties that MAY be set by the server to provide
 additional information about a response. The Reason field of a Status object defines what
 attributes will be set. Clients must ignore fields that do not match the defined type of
 each attribute, and should assume that any attribute may be empty, invalid, or under defined.*/
::orch "kubernetes" "StatusDetails" as StatusDetails {
     /**The kind attribute of the resource associated with the status StatusReason. On some operations
      may differ from the requested resource Kind. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds*/
     kind = null,
     /**The group attribute of the resource associated with the status StatusReason.*/
     group = null,
     /**The name attribute of the resource associated with the status StatusReason (when there is
      a single name which can be described).*/
     name = null,
     /**If specified, the time in seconds before the operation should be retried.*/
     retryAfterSeconds = null,
     /**The Causes array includes more details associated with the StatusReason failure. Not all
      StatusReasons may provide detailed causes.*/
     causes = null,
     /**UID of the resource. (when there is a single resource which can be described). More info:
      http://kubernetes.io/docs/user-guide/identifiers#uids*/
     uid = null
}